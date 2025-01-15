import { useState } from "react";
import { GrClose } from "react-icons/gr";
import axios from 'axios';
import { toast } from "react-toastify";

export default function TestimonialForm({ close }) {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, review, image });

    const testimonialData = {
      testimonial: review,
      userInfo: {
        name: name,
        profilePicture: previewUrl || "",
      },
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/testimonials/addTestimonial`, testimonialData);
      toast.success("Thank you for your feedback!");
      setName("");
      setReview("");
      setImage(null);
      setPreviewUrl(null);
      close()
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit testimonial. Please try again.");
    }
  };

  return (
    <section className=" absolute top-0 z-50 flex items-center justify-center w-screen left-0">
      {/* Backdrop */}
      <div
        onClick={close}
        className="absolute w-full h-screen top-0  backdrop-blur-sm "
      />
      <div className=" mx-auto fixed lg:left-[30%] left-7 top-28 max-w-5xl shadow-lg  shadow-black rounded-3xl lg:top-[25%] py-5 md:py-10 z-50 bg-white border-[1px] border-black/40">
        <div className=" overflow-hidden relative">
          <button
            onClick={close}
            className="absolute right-4 top-2 text-black cursor-pointer z-50"
          >
            <GrClose />
          </button>
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16 p-4 md:p-8">
              {/* Left side - Image upload */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="md:w-48 md:h-48 w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-gray-500">Upload your photo</p>
                    </div>
                  )}
                </div>
                <input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="max-w-[250px]"
                />
              </div>

              {/* Right side - Form content */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-black">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full border-b border-gray-300 focus:border-gold outline-none pb-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="review" className="text-sm text-black">
                    Your Experience
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    className="w-full border-b border-gray-300 focus:border-gold outline-none pb-2"
                    placeholder="Share your experience with us"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black hover:text-white hover:bg-black hover:border hover:border-white border-black border font-semibold rounded-lg hover:scale-105 transition-transform"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
