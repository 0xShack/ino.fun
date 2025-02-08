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
          <p>First Name: {data.personalInfo.firstName}</p>
          <p>Last Name: {data.personalInfo.lastName}</p>
          <p>Date of Birth: {data.personalInfo.dateOfBirth}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Contact Information</h3>
        <div className="space-y-1 text-sm">
          <p>Email: {data.contactInfo.email}</p>
          <p>Phone: {data.contactInfo.phone}</p>
          <p>Address: {data.contactInfo.address}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Preferences</h3>
        <div className="space-y-1 text-sm">
          <p>Notifications: {data.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
          <p>Newsletter: {data.preferences.newsletter ? 'Subscribed' : 'Not subscribed'}</p>
          <p>Theme: {data.preferences.theme}</p>
        </div>
      </div>
    </div>
  );
} 