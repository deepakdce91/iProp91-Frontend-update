import React from "react";
import Card from "./card";
import OwnerCard from "./owner-card";

const FeatureOwnerClub = () => {
  const ownershipVerificiationDiscription = `A robust ownership verification process is crucial to ensure that only legitimate owners are
 part of the club. This process may include`;
  const ownershipVerificiation = [
    {
      heading: "Document Submission",
      content: ` Owners must submit relevant documents such as sale
 agreements, title deeds, and identification proofs for verification`,
      image: "/public/owner-club/document-submission.png",
    },
    {
      heading: "Ownership Validation",
      content: ` Engaging a trusted third-party platform (iProp91) to validate
 ownership claims can enhance credibility.`,
      image: "/public/owner-club/ownership-calidation.png",
    },
    {
      heading: "Regular Audits",
      content: `Periodic audits of membership can help maintain the integrity of the
 club and ensure that all members are verified owners`,
      image: "/public/owner-club/regular-audits.png",
    },
  ];
  const meetingOwnersDiscription = `Facilitating interactions among owners is vital for building a strong community. The club can
 implement`;
  const meetingOwners = [
    {
      heading: "Networking Events",
      content: `Organizing regular meet-ups, both virtual and in-person, to allow
 owners to connect and share experiences`,
      image: "/public/owner-club/networking.png",
    },
    {
      heading: " Discussion Forums",
      content: `Creating online platforms where owners can discuss
 project-related topics, share insights, and seek advice.`,
      image: "/public/owner-club/discussion-forms.png",
    },
    {
      heading: "Collaborative Projects",
      content: ` Encouraging owners to collaborate on initiatives that enhance
 the living experience within the project.`,
      image: "/public/owner-club/collaborative-projects.png",
    },
  ];
  const hidingPersonalityDiscription = ` To protect the privacy of members, the club should prioritize the confidentiality of personally
 identifiable information (PII). This can be achieved through`;
  const hidingPersonality = [
    {
      heading: "Anonymized Profiles",
      content: `Allowing members to create profiles that do not disclose
 sensitive information`,
      image: "/public/owner-club/profile.webp",
    },
    {
      heading: "Data Protection Policies",
      content: `Implementing strict policies regarding the handling and
 sharing of PII, ensuring compliance with relevant privacy laws`,
      image: "/public/owner-club/data-protection.png",
    },
    {
      heading: "Secure Communication Channels",
      content: `Utilizing encrypted communication tools to
 safeguard discussions and information sharing among members`,
      image: "/public/owner-club/secure-communication.webp",
    },
  ];
  const noSpamDiscription = ` To maintain a focused and respectful communication environment, the club should establish
 guidelines to prevent spam. This includes:`;
  const noSpam = [
    {
      heading: "Opt-In Communication",
      content: `Ensuring that members can choose the types of
 communications they wish to receive.`,
      images: "/public/owner-club/communication.png",
    },
    {
      heading: "Content Moderation",
      content: `Appointing moderators among the group members to oversee
 discussions and filter out irrelevant or promotional content`,
      image: "/public/owner-club/content-moderation.png",
    },
    {
      heading: " Clear Communication Policies",
      content: ` Outlining acceptable communication practices and
 consequences for violations to maintain a professional atmosphere`,
      image: "/public/owner-club/communincation-policies.png",
    },
  ];
  const rwaStructureDiscription = ` The club can adopt a Resident Welfare Association (RWA) structure to facilitate democratic
 decision-making and collective action. Key components include`;
  const rwaStructure = [
    {
      heading: " Elected Representatives",
      content: `: Members can elect representatives to voice their concerns
 and lead initiatives on behalf of the community`,
      image: "/public/owner-club/elected-representative.webp",
    },
    {
      heading: "Regular Meetings",
      content: `Scheduling regular meetings to discuss community issues, project
 updates, and collective goals`,
      image: "/public/owner-club/regular-meeting.webp",
    },
    {
      heading: "Voting Mechanisms",
      content: `Implementing transparent voting processes for decision-making
 on important matters affecting the community`,
      image: "/public/owner-club/voting.webp",
    },
  ];
  const coordinatedNeetingsDiscription = `Even before possession, it is essential to coordinate efforts among owners to ensure a
 smooth transition into the community. This can involve`;
  const coordinatedNeetings = [
    {
      heading: "Pre-Possession Meetings",
      content: ` Organizing meetings to discuss expectations, share
 timelines, and address concerns related to the project.`,
      image: "/public/owner-club/meeting1.webp",
    },
    {
      heading: " Task Forces",
      content: `Forming task forces to tackle specific issues such as legal documentation,
 registration process, property ID creation, quality checks, landscaping, security, and
 amenities planning prior to moving in`,
      image: "/public/owner-club/meeting2.png",
    },
    {
      heading: " Resource Sharing",
      content: `Creating a platform for owners to share resources,
 recommendations, and services that can benefit the community.`,
      images: "/public/owner-club/meeting3.png",
    },
  ];

  return (
    <>
      <div className="w-full max-md:pr-[11rem] max-sm: md:w-[70%] pt-0 pb-0 px-4 md:pl-20 md:pr-40 box-border bg-white">
        <div className="text-start mt-4 lg:mt-8">
          <h1 className="font-bold text-2xl lg:text-4xl capitalize">
            Owners' Club
          </h1>
          <p className="mt-4 lg:mt-7 text-base lg:text-lg">
            iProp91 Owners' Club aims to foster a secure and collaborative
            environment for owners, ensuring that their interests are protected
            while promoting community engagement and democratic decision-making.
            Key aspects include ownership verification, privacy protection,
            structured communication, and coordinated efforts among members
          </p>
          <img
            src="/public/owner-club/one.png"
            alt="image"
            className="w-full mt-4 lg:mt-0"
          />
        </div>
        <OwnerCard
          title={"Ownership Verification Process"}
          discription={ownershipVerificiationDiscription}
          list={ownershipVerificiation}
          imageNumber={"two"}
        />
        <OwnerCard
          title={" Meeting Other Owners of the Project"}
          discription={meetingOwnersDiscription}
          list={meetingOwners}
          imageNumber={"three"}
        />
        <OwnerCard
          title={"Hiding Personally Identifiable Information"}
          discription={hidingPersonalityDiscription}
          list={hidingPersonality}
          imageNumber={"four"}
        />
        <OwnerCard
          title={"NoSpamCommunication"}
          list={noSpam}
          discription={noSpamDiscription}
          imageNumber={"five"}
        />
        <OwnerCard
          title={" RWAStructure for Achieving Common Goals"}
          list={rwaStructure}
          discription={rwaStructureDiscription}
          imageNumber={"six"}
        />
        <OwnerCard
          title={"Coordinated Meetings and Efforts Before Possession"}
          list={coordinatedNeetings}
          discription={coordinatedNeetingsDiscription}
          imageNumber={"seven"}
        />
        <p className="mt-8 lg:mt-15 text-base lg:text-lg text-start">
          In conclusion, a closed club for verified owners of a real estate
          project can significantly enhance the ownership experience by
          fostering a sense of community, ensuring privacy, and promoting
          collaborative efforts. By implementing these key features, the club
          can create a supportive environment that empowers owners to achieve
          their common goals effectively
        </p>
      </div>
    </>
  );
};

export default FeatureOwnerClub;
