import Spinner from 'src/components/spinners/Spinner'

export default function AuthLoadingSpinner() {
  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="flex flex-col items-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tighter text-center">
          Loading
        </h1>
        <p className="mb-4 text-center">
          Please wait while your
          <br /> profile is being loaded
        </p>
        <Spinner />
      </div>
    </div>
  )
}
