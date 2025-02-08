import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnrollmentData } from "@/components/enroll/enrollment-form";

type StepProps = {
  data: EnrollmentData;
  updateFields: (fields: Partial<EnrollmentData>) => void;
}

export function ContactInfoStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={data.contactInfo.email}
          onChange={e => updateFields({ 
            contactInfo: { ...data.contactInfo, email: e.target.value }
          })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          required
          value={data.contactInfo.phone}
          onChange={e => updateFields({ 
            contactInfo: { ...data.contactInfo, phone: e.target.value }
          })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          required
          value={data.contactInfo.address}
          onChange={e => updateFields({ 
            contactInfo: { ...data.contactInfo, address: e.target.value }
          })}
        />
      </div>
    </div>
  );
} 