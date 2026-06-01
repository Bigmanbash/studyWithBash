import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-brand-green">Bash Academy</h3>
                        <p className="text-sm text-(--muted)">
                            The #1 platform for SS1-SS2 and JAMB candidates. Demystifying complex subjects to guarantee your success.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-(--heading)">Platform</h4>
                        <ul className="space-y-2 text-sm text-(--muted)">
                            <li><Link href="/courses/math" className="hover:text-(--heading) transition-colors">Mathematics</Link></li>
                            <li><Link href="/courses/physics" className="hover:text-(--heading) transition-colors">Physics</Link></li>
                            <li><Link href="/courses/chemistry" className="hover:text-(--heading) transition-colors">Chemistry</Link></li>
                            <li><Link href="/pricing" className="hover:text-(--heading) transition-colors">Pricing</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-(--heading)">Company</h4>
                        <ul className="space-y-2 text-sm text-(--muted)">
                            <li><Link href="/about" className="hover:text-(--heading) transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-(--heading) transition-colors">Contact</Link></li>
                            <li><Link href="/careers" className="hover:text-(--heading) transition-colors">Careers</Link></li>
                            <li><Link href="/terms" className="hover:text-(--heading) transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-(--heading)">Stay Updated</h4>
                        <p className="text-sm text-(--muted)">
                            Subscribe to our newsletter for exclusive offers and style tips.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--muted) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <button className="inline-flex h-9 items-center justify-center rounded-md bg-brand-green px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-green/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-(--muted)">
                    © {new Date().getFullYear()} Bash Academy. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
