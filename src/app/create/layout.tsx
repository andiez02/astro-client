import { MintProvider } from "@/src/components/providers/MintProvider";

export default function CreateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MintProvider>
            {children}
        </MintProvider>
    );
}
