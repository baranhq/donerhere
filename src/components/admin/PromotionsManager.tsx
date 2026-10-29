import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import { api, useSite } from "../../store/site";
import type { Promotion } from "../../store/site";
import { uploadImage } from "../../lib/uploadImage";
import { ui } from "../../styles/ui";
type Saved = { promotions: Promotion[]; revision: number };
export default function PromotionsManager() {
  const { refresh } = useSite();
  const [slides, setSlides] = useState<Promotion[]>([]);
  const [revision, setRevision] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setRevision(null);
    setError("");
    api<Saved>("/admin/promotions")
      .then((value) => {
        if (!cancelled) {
          setSlides(value.promotions);
          setRevision(value.revision);
        }
      })
      .catch((cause) => {
        if (!cancelled)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load promotions",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [reload]);
  function edit(id: string, changes: Partial<Promotion>) {
    setSlides((current) =>
      current.map((slide) =>
        slide.id === id ? { ...slide, ...changes } : slide,
      ),
    );
    setMessage("");
  }
  function move(index: number, offset: number) {
    setSlides((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }
  async function upload(id: string, file: File) {
    setBusy(true);
    setError("");
    try {
      edit(id, { image: await uploadImage(file) });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not upload image",
      );
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const saved = await api<Saved>("/admin/promotions", "PUT", {
        promotions: slides,
        revision,
      });
      setRevision(saved.revision);
      setSlides(saved.promotions);
      await refresh();
      setMessage("Promotions saved. The homepage now uses these slides.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save promotions",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="max-w-4xl space-y-5">
      <p className="text-stone-600">
        Manage the homepage carousel. Changes go live when you save. Use up to
        10 slides.
      </p>
      {error && (
        <p role="alert" className="text-red-800">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {revision === null ? (
        <p role="status">Loading promotions…</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <fieldset disabled={busy} className="space-y-5">
            {slides.map((slide, index) => (
              <section
                key={slide.id}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <header className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="mb-0! text-lg!">Slide {index + 1}</h2>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label={`Move slide ${index + 1} up`}
                      disabled={index === 0}
                      className="rounded-md p-2 hover:bg-stone-100"
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move slide ${index + 1} down`}
                      disabled={index === slides.length - 1}
                      className="rounded-md p-2 hover:bg-stone-100"
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove slide ${index + 1}`}
                      className="rounded-md p-2 text-red-800 hover:bg-red-50"
                      onClick={() =>
                        setSlides((current) =>
                          current.filter((entry) => entry.id !== slide.id),
                        )
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </header>
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt="Slide preview"
                    className="mb-5 max-h-48 w-full rounded-lg bg-stone-50 object-contain"
                  />
                ) : (
                  <div className="mb-5 rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
                    Upload an image or enter its URL below.
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    Image URL
                    <input
                      required
                      maxLength={500}
                      value={slide.image}
                      onChange={(event) =>
                        edit(slide.id, { image: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Upload image (up to 2 MB)
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void upload(slide.id, file);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <label>
                    Image description
                    <input
                      required
                      maxLength={200}
                      value={slide.alt}
                      onChange={(event) =>
                        edit(slide.id, { alt: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Website link (optional)
                    <input
                      placeholder="/menu/doner-wraps"
                      maxLength={300}
                      value={slide.link}
                      onChange={(event) =>
                        edit(slide.id, { link: event.target.value })
                      }
                    />
                  </label>
                </div>
                <label className="mt-4 flex-row! items-center">
                  <input
                    type="checkbox"
                    className="w-auto!"
                    checked={slide.available}
                    onChange={(event) =>
                      edit(slide.id, { available: event.target.checked })
                    }
                  />
                  Visible on homepage
                </label>
              </section>
            ))}
            {!slides.length && (
              <p className="rounded-lg border border-dashed border-stone-300 p-8 text-center">
                No slides. Add a promotion to show the carousel.
              </p>
            )}
            <button
              type="button"
              className={`${ui.button} gap-2 bg-[#f5e9e5]! text-stone-800!`}
              disabled={slides.length >= 10}
              onClick={() =>
                setSlides((current) => [
                  ...current,
                  {
                    id: crypto.randomUUID(),
                    image: "",
                    alt: "",
                    link: "",
                    available: true,
                  },
                ])
              }
            >
              <Plus size={18} />
              Add promotion
            </button>
            <div className="flex flex-wrap gap-4">
              <button className={ui.button}>Save promotions</button>
              <button
                type="button"
                className={ui.textLink}
                onClick={() => {
                  if (
                    window.confirm(
                      "Discard unsaved changes and reload promotions?",
                    )
                  )
                    setReload((value) => value + 1);
                }}
              >
                Reload saved slides
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </section>
  );
}
