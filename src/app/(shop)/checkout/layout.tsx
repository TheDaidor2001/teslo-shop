import { middleware } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function CheckOutLayout({
    children
}: {
    children: React.ReactNode;
}) {

    const session = await middleware()

    if (!session) {
        redirect('/auth/login?redirecTo=/checkout/address')
    }

    return (
        <>
            {children}
        </>
    );
}