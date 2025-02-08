import { EnrollmentData } from "../enrollment-form";

type StepProps = {
  data: EnrollmentData;
  updateFields: (fields: Partial<EnrollmentData>) => void;
}

export function ReviewStep({ data }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Personal Information</h3>
        <div className="space-y-1 text-sm">
          <p>Name: {data.personalInfo.name}</p>
          <p>Profile Picture: {data.personalInfo.profilePicture ? 
            data.personalInfo.profilePicture.url : 
            'No image uploaded'}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Social Information</h3>
        <div className="space-y-1 text-sm">
          <p>Twitter Handle: {data.socialInfo.twitterHandle}</p>
        </div>
      </div>
    </div>
  );
} 