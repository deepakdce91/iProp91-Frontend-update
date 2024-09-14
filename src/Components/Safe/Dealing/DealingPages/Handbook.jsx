const PackageTable = () => {
  const packages = [
    { name: "Basic", price: 500 },
    { name: "Advance", price: 1000 },
    { name: "Premium", price: 1500 },
    { name: "Ultimate", price: 2000 },
    { name: "Platinum", price: 2500 },
    { name: "Diamond", price: 3000 },
  ];

  return (
    <div className="flex justify-center items-center min-h-96  sm:rounded-xl sm:shadow-md w-full overflow-y-scroll no-scrollbar">
      <table className="table-auto w-2/3  rounded-lg my-10">
        <thead>
          <tr className="border-b-2 border-gold text-xs lg:text-sm">
            <th className="py-3 px-6 text-left text-gray-700 text-nowrap">Package Name</th>
            <th className="py-3 px-6 text-left text-gray-700">Price</th>
            <th className="py-3 px-6 text-left text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={index} className="border-b hover:">
              <td className="py-3 px-6 text-gray-700 text-xs lg:text-sm">{pkg.name}</td>
              <td className="py-3 px-6 text-gray-700 text-xs lg:text-sm">{pkg.price}</td>
              <td className="py-3 px-6">
                <button className="py-2 px-4  border border-yellow-400  rounded hover:bg-gold hover:text-white transition text-xs lg:text-sm">
                  Request
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RequestHanbook = () => {
  return (
    <>
      <div class="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex  flex-col ">
        <div class="hidden lg:!block bg-primary min-h-[73px]  relative  py-16 px-20  w-full">
          <div class="flex flex-col relative z-20">
            <p class="text-white text-4xl">Request</p>
            <p class="text-white text-4xl mb-4">Handbook</p>
            <div className="bg-white rounded-xl w-full">
              <PackageTable />
            </div>
          </div>
          <img
            alt="relationship"
            loading="lazy"
            width="618"
            height="411"
            decoding="async"
            data-nimg="1"
            class="h-[300px] w-[451px] absolute z-10 left-[-2px] bottom-0"
            src="/webp/bg1.webp"
            style={{ color: "transparent" }}
          />
          <img
            alt="relationship"
            loading="lazy"
            width="524"
            height="391"
            decoding="async"
            data-nimg="1"
            class="h-[285px] w-[382px] absolute z-10 right-0 bottom-0"
            src="/webp/bg2.webp"
            style={{ color: "transparent" }}
          />
        </div>
        <div class="lg:!hidden relative bg-primary flex  flex-col gap-3 py-16 px-6 w-full">
        <div class="flex flex-col relative z-20">
            <p class="text-white text-4xl">Request</p>
            <p class="text-white text-4xl mb-4">Handbook</p>
            <div className="bg-white rounded-xl w-full">
              <PackageTable />
            </div>
          </div>

          <img
            alt="relationship"
            loading="lazy"
            width="618"
            height="411"
            decoding="async"
            data-nimg="1"
            class="h-[100px] w-[150px] absolute z-10 left-[-1px] bottom-0"
            src="/webp/bg1.webp"
            style={{ color: "transparent" }}
          />
          <img
            alt="relationship"
            loading="lazy"
            width="524"
            height="391"
            decoding="async"
            data-nimg="1"
            class="h-[85px] w-[127px] absolute z-10 right-0 bottom-0"
            src="/webp/bg2.webp"
            style={{ color: "transparent" }}
          />
        </div>
      </div>
    </>
  );
};

export default function Handbook() {
  return (
    <>
      <RequestHanbook />
    </>
  );
}
