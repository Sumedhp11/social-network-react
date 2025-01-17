import { formdata } from "@/components/forms/RegisterForm";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const RenderSummary = ({ formData }: { formData: formdata }) => {
  const avatarSrc = formData.avatar
    ? URL.createObjectURL(formData.avatar)
    : undefined;

  const handleRegister = () => {
    const form = new FormData();
    if (formData.email) {
      form.append("email", formData.email);
    }
    if (formData.username) {
      form.append("username", formData.username);
    }
    if (formData.password) {
      form.append("password", formData.password);
    }

    if (formData.avatar) {
      form.append("avatar", formData.avatar);
    }
    if (formData.bio) {
      form.append("bio", formData.bio);
    }
  };
  return (
    <div className="space-y-4 flex flex-col text-white">
      <div className="flex items-center gap-5">
        <p className="text-sm font-normal">Username: {""}</p>
        <p className="text-base font-medium">{formData.username}</p>
      </div>
      <div className="flex items-center gap-5">
        <p className="text-sm font-normal">Email: {""}</p>
        <p className="text-base font-medium">{formData.email}</p>
      </div>
      <div className="flex items-center gap-5">
        <p className="text-sm font-normal">Avatar: {""}</p>
        <Avatar>
          <AvatarImage
            src={avatarSrc || "https://github.com/shadcn.png"}
            alt="avatar"
          />
        </Avatar>
        {!avatarSrc && <span>{"(Not Set)"}</span>}
      </div>
      <div className="flex items-center gap-5">
        <p className="text-sm font-normal">Bio: {""}</p>
        <p className="text-base font-medium">
          {formData.bio ? formData.bio : "(Not Set)"}
        </p>
      </div>
      <Button
        className="w-full bg-[#189FF2] hover:bg-blue-600"
        onClick={handleRegister}
      >
        Register
      </Button>
    </div>
  );
};
export default RenderSummary;
