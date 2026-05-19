import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-neutral-200/60 bg-white">
            <div className="container py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#17A546]">Bash Academy</h3>
                        <p className="text-sm text-muted-foreground">
                            The #1 platform for SS1-SS2 and JAMB candidates. Demystifying complex subjects to guarantee your success.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/courses/math" className="hover:text-foreground transition-colors">Mathematics</Link></li>
                            <li><Link href="/courses/physics" className="hover:text-foreground transition-colors">Physics</Link></li>
                            <li><Link href="/courses/chemistry" className="hover:text-foreground transition-colors">Chemistry</Link></li>
                            <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                            <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for exclusive offers and style tips.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Bash Academy. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
