import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EnrollmentData } from "../enrollment-form";

type StepProps = {
  data: EnrollmentData;
  updateFields: (fields: Partial<EnrollmentData>) => void;
}

export function PreferencesStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="notifications"
          checked={data.preferences.notifications}
          onCheckedChange={(checked) => updateFields({ 
            preferences: { ...data.preferences, notifications: checked as boolean }
          })}
        />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={data.preferences.newsletter}
          onCheckedChange={(checked) => updateFields({ 
            preferences: { ...data.preferences, newsletter: checked as boolean }
          })}
        />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>

      <div className="space-y-2">
        <Label>Theme Preference</Label>
        <RadioGroup
          value={data.preferences.theme}
          onValueChange={(value) => updateFields({ 
            preferences: { ...data.preferences, theme: value as 'light' | 'dark' }
          })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
} 