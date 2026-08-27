import { db } from "@/lib/neon";
import { payments, courses, user } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";
import { creditCommission } from "@/app/api/affiliates/mutations";
import { generateProxyAccessCodes } from "@/app/api/access-codes/mutations";
import { getAffiliateByCode } from "@/app/api/affiliates/queries";
import { DEFAULT_COMMISSION_RATE } from "@/lib/affiliate-constants";
import { sendEmail } from "@/lib/resend/client";
import { getCourseEnrollmentEmailHtml, getProxyAccessCodesEmailHtml } from "@/lib/resend/templates";

/**
 * Executes post-payment fulfillment:
 * 1. Generates proxy codes (if proxy purchase) or processes referral commissions
 * 2. Sends payment receipt / enrollment email to student
 * 3. Sends batch access codes email to agent (if proxy)
 */
export async function fulfillApprovedPayment(payment: typeof payments.$inferSelect) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.studywithbash.online";

    // 1. Fetch course details
    const [courseInfo] = await db
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        subject: courses.subject,
      })
      .from(courses)
      .where(eq(courses.id, payment.courseId))
      .limit(1);

    // 2. Fetch buyer user details
    const [buyerUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, payment.userId))
      .limit(1);

    // Case A: Proxy Access Codes Purchase by Agent
    if (payment.isProxy && payment.affiliateId && payment.proxyQuantity) {
      let generatedCodes: Array<{ code: string }> = [];

      if (courseInfo) {
        generatedCodes = await generateProxyAccessCodes({
          affiliateId: payment.affiliateId,
          courseId: payment.courseId,
          courseSubject: courseInfo.subject,
          tier: payment.tier,
          paymentId: payment.id,
          quantity: payment.proxyQuantity,
        });
      }

      await creditCommission({
        affiliateId: payment.affiliateId,
        paymentId: payment.id,
        studentId: payment.userId,
        courseId: payment.courseId,
        type: "proxy",
        saleAmount: payment.amount,
        commissionRate: DEFAULT_COMMISSION_RATE,
      });

      // Send batch codes email to agent
      if (buyerUser?.email && generatedCodes.length > 0 && courseInfo) {
        try {
          await sendEmail({
            to: buyerUser.email,
            subject: `Your ${payment.proxyQuantity} Access Codes: ${courseInfo.title} - Bash Academy 🚀`,
            html: getProxyAccessCodesEmailHtml({
              agentName: buyerUser.name || "Partner",
              courseSubject: courseInfo.subject,
              tier: payment.tier,
              quantity: payment.proxyQuantity,
              codes: generatedCodes.map((c) => c.code),
              dashboardUrl: `${appUrl}/affiliates/dashboard`,
            }),
          });
        } catch (emailErr) {
          console.error("[Proxy Codes Email Error]:", emailErr);
        }
      }
    } else {
      // Case B: Direct Student Course Purchase
      if (payment.referralCode) {
        const affiliate = await getAffiliateByCode(payment.referralCode);
        if (affiliate) {
          await creditCommission({
            affiliateId: affiliate.affiliateId,
            paymentId: payment.id,
            studentId: payment.userId,
            courseId: payment.courseId,
            type: "referral",
            saleAmount: payment.amount,
            commissionRate: affiliate.commissionRate,
          });
        }
      }

      // Send enrollment confirmation email to student
      if (buyerUser?.email && courseInfo) {
        try {
          const courseUrl = `${appUrl}/dashboard/courses/${courseInfo.slug || courseInfo.id}`;
          await sendEmail({
            to: buyerUser.email,
            subject: `Payment Confirmed: ${courseInfo.title} - Bash Academy 🎉`,
            html: getCourseEnrollmentEmailHtml({
              studentName: buyerUser.name || "Student",
              courseName: courseInfo.title,
              tier: payment.tier,
              amountFormatted: `₦${(payment.amount / 100).toLocaleString()}`,
              reference: payment.reference || undefined,
              courseUrl,
            }),
          });
        } catch (emailErr) {
          console.error("[Course Enrollment Email Error]:", emailErr);
        }
      }
    }
  } catch (error) {
    console.error("[Payment Fulfillment Error]:", error);
  }
}
