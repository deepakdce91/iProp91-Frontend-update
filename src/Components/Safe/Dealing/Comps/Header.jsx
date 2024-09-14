import { Link } from "react-router-dom";

export default function NameHeader() {
  return (
    <>
      <div class="hidden lg:!block">
        <div class="lg:pt-5 mb-3 px-7 pt-3">
          <div class="flex justify-between">
            <div class="mb-auto">
              <p class="text-xl font-semibold mb-2">
                iProp <span class="text-primary">Safe</span>
              </p>
              <hr class="bg-primary w-12 h-1 rounded-sm" />
            </div>
            <button class="px-1 py-1 flex mt-auto mb-auto bg-white rounded-full border-black border-[1px]">
              <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mt-auto mb-auto mr-1">
                <img
                  class="aspect-square h-full w-full"
                  alt="profilePic"
                  src="https://images.unsplash.com/photo-1523560220134-8f26a720703c?q=80&amp;w=1854&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </span>
              <p class="mt-auto mb-auto text-xs mx-1">Deepak</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chevron-down mt-auto mb-auto h-4"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-between px-7 align-middle">
          <p class="text-secondary text-xs">
          Upload all your real estate documents, applicable at different stages of ownership in an encrypted safe, accessible at all times
          </p>
          <Link to="/addproperty">
            <button class="text-black border-secondary hover:border-simple shadow-2xl flex border-[1.5px] px-5 text-xs py-3 rounded-md mt-4 gap-2">
              Add property
              <img
                alt="plus"
                loading="lazy"
                width="12"
                height="12"
                decoding="async"
                data-nimg="1"
                class="mt-auto mb-auto"
                style={{ color: "transparent" }}
                src="/svgs/plus.aef96496.svg"
              />
            </button>
          </Link>
        </div>
      </div>

      <div class="mt-5 px-8 lg:!hidden flex flex-row justify-between">
        <p class="text-xl font-semibold mb-2">
          iProp91 <span class="text-primary">Safe</span>
        </p>
      </div>
    </>
  );
}
