"use client";
import { Phone, User } from "lucide-react";
import { useGetPartnerDetail } from "../api/getPartnersDetail";
import { useParams } from "next/navigation";
import ProjectPageComponent from "../component/project/projectPage";

export default function PartnerDetailPage() {
  const params = useParams();
  const partnerId = params?.id as string;

  const { data: partnerData } = useGetPartnerDetail({
    params: { id: partnerId },
  });

  return (
    <div className="flex flex-col gap-4 overflow-auto py-4">
      <div className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-md">
        <div className="text-xl-bold text-brand-800">
          {partnerData?.partnerName}
        </div>
        <div>Partner code: {partnerData?.partnerCode}</div>

        <div className="mt-6 flex gap-2">
          Legal representative:
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <div>{partnerData?.legalRepresentative}</div>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <div>{partnerData?.legalRepresentativePhone}</div>
          </div>
        </div>
        <div className="flex gap-2">
          Contact person:
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <div>{partnerData?.contactPerson}</div>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <div>{partnerData?.contactPersonPhone}</div>
          </div>
        </div>
      </div>
      <div className="w-1/2 min-w-[600px] rounded-md border border-gray-200 px-3 py-2 shadow-md">
        <div className="text-lg-bold text-brand-800 mb-2">
          Basic information
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>Tax code</div>
          <div className="col-span-2">{partnerData?.taxCode}</div>
        </div>
        <div className="bg-info-200 my-2 h-[1px]" />
        <div className="grid grid-cols-3 gap-2">
          <div>Bank name</div>
          <div className="col-span-2">{partnerData?.bankName}</div>
        </div>
        <div className="bg-info-200 my-2 h-[1px]" />
        <div className="grid grid-cols-3 gap-2">
          <div>Bank account number</div>
          <div className="col-span-2">{partnerData?.bankAccountNumber}</div>
        </div>
        <div className="bg-info-200 my-2 h-[1px]" />
      </div>
      <div className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-md">
        <div className="text-lg-bold text-brand-800 mb-2">Projects</div>
        <ProjectPageComponent paramsKey="prj" partnerId={partnerId} />
      </div>

      {/* <div className="w-1/2 min-w-[600px] rounded-md border border-gray-200 px-3 py-2 shadow-md">
        <div className="text-lg-bold text-brand-800 mb-2">Projects</div>
        <div className="bg-info-50 border-brand-200 rounded-md border p-2">
          <div className="text-md-bold text-info-900 mb-3">
            Ten project o day
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>Code</div>
            <div className="col-span-2">324FJI3</div>
          </div>
          <div className="bg-brand-200 my-2 h-[1px]" />
          <div className="grid grid-cols-3 gap-2">
            <div>Address</div>
            <div className="col-span-2">Mai chi tho</div>
          </div>
          <div className="bg-brand-200 my-2 h-[1px]" />
          <div className="grid grid-cols-3 gap-2">
            <div>Representative</div>
            <div className="col-span-2">Nguyen van b</div>
          </div>
          <div className="bg-brand-200 my-2 h-[1px]" />
          <div className="grid grid-cols-3 gap-2">
            <div>Representative phone</div>
            <div className="col-span-2">088999222</div>
          </div>
          <div className="bg-brand-200 my-2 h-[1px]" />
          <div className="grid grid-cols-3 gap-2">
            <div>Contact person</div>
            <div className="col-span-2">aaaa</div>
          </div>
          <div className="bg-brand-200 my-2 h-[1px]" />
          <div className="grid grid-cols-3 gap-2">
            <div>Contact phone</div>
            <div className="col-span-2">238493280</div>
          </div>
          <div className="bg-brand-200 my-2 h-[1px]" />
          <div className="grid grid-cols-3 gap-2">
            <div>Contact address</div>
            <div className="col-span-2">Nguyen van linh</div>
          </div>
          <div className="bg-brand-200 my-2 h-[1px]" />
        </div>
      </div> */}
    </div>
  );
}
