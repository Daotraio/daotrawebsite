import Link from "next/link";

// There is deliberately no "email me a reset link" form (BD-71 as amended
// 2026-10-29): no outbound email is approved, and a self-service request form
// would tell anyone which emails hold an account. Daotra staff generate a
// one-time reset link and deliver it to the Publisher by hand.
export function ForgotPasswordNotice({ loginHref }: { loginHref: string }) {
  return (
    <div className="space-y-5 text-sm text-muted-foreground">
      <p>
        Contact your Daotra Affiliate Manager or the Daotra team on{" "}
        <a
          href="https://t.me/daotra"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-silver hover:underline"
        >
          Telegram
        </a>{" "}
        from your registered contact details. They will send you a one-time link to set a new
        password.
      </p>
      <p>Reset links are single-use and expire after a short time.</p>
      <p className="text-center">
        <Link href={loginHref} className="text-accent-silver hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
