import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnrollmentData } from "../enrollment-form";
import { UploadDropzone } from "@/utils/uploadthing";

type StepProps = {
  data: EnrollmentData;
  updateFields: (fields: Partial<EnrollmentData>) => void;
}

export function PersonalInfoStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={data.personalInfo.name}
          onChange={e => updateFields({ 
            personalInfo: { ...data.personalInfo, name: e.target.value }
          })}
        />
      </div>
      <div className="space-y-2">
        <Label>Profile Picture (Required)</Label>
        <UploadDropzone
          endpoint="profileImage"
          onUploadBegin={() => {
            // Optional: Show loading state
          }}
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              updateFields({ 
                personalInfo: { 
                  ...data.personalInfo, 
                  profilePicture: { 
                    url: res[0].url, 
                    key: res[0].key 
                  } 
                }
              });
            }
          }}
          onUploadError={(error: Error) => {
            console.error(error);
          }}
        />
      </div>
    </div>
  );
} 