export default function LoadingSpinner() {
  return (
    <div className="d-flex flex-column jusify-content-center align-items-center w-100 h-100 py-5 my-5">
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}