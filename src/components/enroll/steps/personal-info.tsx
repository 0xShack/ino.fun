import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnrollmentData } from "@/components/enroll/enrollment-form";

type StepProps = {
  data: EnrollmentData;
  updateFields: (fields: Partial<EnrollmentData>) => void;
}

export function PersonalInfoStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          required
          value={data.personalInfo.firstName}
          onChange={e => updateFields({ 
            personalInfo: { ...data.personalInfo, firstName: e.target.value }
          })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          required
          value={data.personalInfo.lastName}
          onChange={e => updateFields({ 
            personalInfo: { ...data.personalInfo, lastName: e.target.value }
          })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          required
          value={data.personalInfo.dateOfBirth}
          onChange={e => updateFields({ 
            personalInfo: { ...data.personalInfo, dateOfBirth: e.target.value }
          })}
        />
      </div>
    </div>
  );
} 