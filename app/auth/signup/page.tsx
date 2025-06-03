import AuthForm from '@/components/core/forms/authForm';

const page = () => {
  return (
    <div className="w-full min-h-screen grid place-items-center px-5">
      <AuthForm type="signup" />
    </div>
  );
};

export default page;
