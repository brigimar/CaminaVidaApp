import WizardWrapper from './WizardWrapper';

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <WizardWrapper>{children}</WizardWrapper>;
}
