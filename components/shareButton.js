import { toast } from "react-hot-toast";

export function ShareButton({ id, title }) {
  async function ShareMovie() {
    try {
      await navigator.share({
        title: title,
        url: "https://next-yt.vercel.app/watch/" + id,
      });
    } catch (err) {
      navigator.clipboard
        .writeText("https://next-yt.vercel.app/watch/" + id)
        .then(function () {
          toast.success("Copied to clipboard!");
        });
    }
  }
  return (
    id &&
    title && (
      <button
        onClick={async () => await ShareMovie()}
        className="btn btn-success text-black p-2 rounded-circle"
      >
        <span className="d-block material-icons align-middle">share</span>
      </button>
    )
  );
}
