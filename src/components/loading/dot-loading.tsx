export default function DotLoading() {
  return (
    <div className='flex items-center justify-center space-x-2 bg-transparent'>
      <span className='sr-only'>Loading...</span>
      <div className='bg-green-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]' />
      <div className='bg-green-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]' />
      <div className='bg-green-primary h-2 w-2 animate-bounce rounded-full' />
    </div>
  )
}
