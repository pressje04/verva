export type CompanyProfile = {
    principles: string[]; //What values does this company have or want its future employees to have?
    products: string[]; //AWS for Amazon, YouTube for Google, Maps for Apple
    toneHints: string[]; //Specific values, like iterate quickly, no supervision, user focused
};

export const companyProfiles: Record<string, CompanyProfile> = {
    amazon: {
        principles: ['Customer Obsession','Ownership','Bias for Action','Dive Deep','Deliver Results'],
        products: ['Retail marketplace','Prime','AWS Lambda','Alexa'],
        toneHints: ['data-driven', 'hands-on', 'scrappy'],
      },
      google: {
        principles: ['User Focus','Googleyness','Collaboration','Learning Mindset'],
        products: ['Search','Maps','YouTube','Android','Gmail'],
        toneHints: ['clarity of thought','structured answers','consider users at scale'],
      },
      meta: {
        principles: ['Move Fast','Be Bold','Focus on Impact','Be Open'],
        products: ['Instagram','Facebook Feed','Messenger','WhatsApp'],
        toneHints: ['iterate quickly','product sense','measure impact'],
      },
}

export function getCompanyProfile(name?: string | null) {
    const key = (name ?? '').toLowerCase();
    return companyProfiles[key] ?? null;
}