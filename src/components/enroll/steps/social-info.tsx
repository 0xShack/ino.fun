import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnrollmentData } from "../enrollment-form";

type StepProps = {
  data: EnrollmentData;
  updateFields: (fields: Partial<EnrollmentData>) => void;
}

export function SocialInfoStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="twitterHandle">Twitter/X Handle</Label>
        <Input
          id="twitterHandle"
          required
          placeholder="@username"
          value={data.socialInfo.twitterHandle}
          onChange={e => {
            const value = e.target.value.startsWith('@') ? 
              e.target.value : 
              `@${e.target.value}`;
            updateFields({ 
              socialInfo: { ...data.socialInfo, twitterHandle: value }
            });
          }}
        />
      </div>
    </div>
  );
} 