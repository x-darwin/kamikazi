"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Package {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  popular?: boolean;
}

interface PackageSelectionProps {
  packages: Package[];
  selectedPackageId: string;
  onPackageSelect: (id: string) => void;
}

export function PackageSelection({
  packages,
  selectedPackageId,
  onPackageSelect,
}: PackageSelectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">Choose Your Package</h2>
        <p className="text-muted-foreground">Select the plan that works best for you</p>
      </div>

      <RadioGroup
        value={selectedPackageId}
        onValueChange={onPackageSelect}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {packages.map((pkg) => (
          <label
            key={pkg.id}
            className={`relative flex flex-col p-6 cursor-pointer rounded-lg border-2 transition-all ${
              selectedPackageId === pkg.id 
                ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                : 'border-border hover:border-primary/50 dark:border-gray-700 dark:hover:border-primary/50'
            }`}
          >
            <RadioGroupItem
              value={pkg.id}
              id={pkg.id}
              className="sr-only"
            />
            {pkg.popular && (
              <span className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Most Popular
              </span>
            )}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg dark:text-gray-100">{pkg.name}</h3>
              <p className="text-muted-foreground text-sm">{pkg.description}</p>
              <div className="text-2xl font-bold dark:text-gray-100">
                ${pkg.price}
                <span className="text-base font-normal text-muted-foreground">/{pkg.period}</span>
              </div>
            </div>
          </label>
        ))}
      </RadioGroup>
    </section>
  );
}