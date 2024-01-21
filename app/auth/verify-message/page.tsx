import Button from "@/app/components/button";

export default function VerifyMessage()  {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <p>An email containing a verification link has been sent to your email.</p>
      <p>Click on the link to verify your account.</p>
      <Button className="mt-4">Resend Email</Button>
    </div>
  )
}