import React, { useEffect } from "react";
import OwnerCard from "./owner-card";

const ServicesOwnerClub = () => {
  const ownershipVerificiationDiscription = `A robust ownership verification process is crucial to ensure that only legitimate owners are part of the club.`;
  const ownershipVerificiation = [
    {
      heading: "Document Submission",
      content: `Owners must submit relevant documents such as sale agreements, title deeds, and identification proofs for verification`,
      image: "/owner-club/document-submission.png",
    },
    {
      heading: "Ownership Validation",
      content: `Engaging a trusted third-party platform (iProp91) to validate ownership claims can enhance credibility.`,
      image: "/owner-club/ownership-calidation.png",
    },
    {
      heading: "Regular Audits",
      content: `Periodic audits of membership help maintain the integrity of the club and ensure all members are verified owners`,
      image: "/owner-club/regular-audits.png",
    },
  ];

  const meetingOwnersDiscription = `Facilitating interactions among owners is vital for building a strong community.`;
  const meetingOwners = [
    {
      heading: "Networking Events",
      content: `Organizing regular meet-ups, both virtual and in-person, to allow owners to connect and share experiences`,
      image: "/owner-club/networking.png",
    },
    {
      heading: "Discussion Forums",
      content: `Creating online platforms where owners can discuss project-related topics, share insights, and seek advice.`,
      image: "/owner-club/discussion-forms.png",
    },
    {
      heading: "Collaborative Projects",
      content: `Encouraging owners to collaborate on initiatives that enhance the living experience within the project.`,
      image: "/owner-club/collaborative-projects.png",
    },
  ];

  const hidingPersonalityDiscription = `To protect member privacy, the club prioritizes confidentiality of personally identifiable information (PII).`;
  const hidingPersonality = [
    {
      heading: "Anonymized Profiles",
      content: `Allowing members to create profiles that don't disclose sensitive information`,
      image: "/owner-club/profile.webp",
    },
    {
      heading: "Data Protection Policies",
      content: `Implementing strict policies for handling and sharing PII, ensuring compliance with privacy laws`,
      image: "/owner-club/data-protection.png",
    },
    {
      heading: "Secure Communication Channels",
      content: `Utilizing encrypted communication tools to safeguard discussions among members`,
      image: "/owner-club/secure-communication.webp",
    },
  ];

  const noSpamDiscription = `To maintain focused communication, the club establishes guidelines to prevent spam.`;
  const noSpam = [
    {
      heading: "Opt-In Communication",
      content: `Ensuring members can choose the types of communications they receive.`,
      image: "/owner-club/communication.png",
    },
    {
      heading: "Content Moderation",
      content: `Appointing moderators to oversee discussions and filter irrelevant content`,
      image: "/owner-club/content-moderation.png",
    },
    {
      heading: "Clear Communication Policies",
      content: `Outlining acceptable practices and consequences for violations`,
      image: "/owner-club/communincation-policies.png",
    },
  ];

  const rwaStructureDiscription = `The club can adopt a Resident Welfare Association (RWA) structure for democratic decision-making.`;
  const rwaStructure = [
    {
      heading: "Elected Representatives",
      content: `Members elect representatives to voice concerns and lead community initiatives`,
      image: "/owner-club/elected-representative.webp",
    },
    {
      heading: "Regular Meetings",
      content: `Scheduling meetings to discuss community issues and collective goals`,
      image: "/owner-club/regular-meeting.webp",
    },
    {
      heading: "Voting Mechanisms",
      content: `Implementing transparent voting processes for important decisions`,
      image: "/owner-club/voting.webp",
    },
  ];

  const coordinatedNeetingsDiscription = `Before possession, coordinate efforts among owners for a smooth transition.`;
  const coordinatedNeetings = [
    {
      heading: "Pre-Possession Meetings",
      content: `Organizing meetings to discuss expectations and address project concerns.`,
      image: "/owner-club/meeting1.webp",
    },
    {
      heading: "Task Forces",
      content: `Forming groups to tackle specific issues like legal documentation and quality checks`,
      image: "/owner-club/meeting2.png",
    },
    {
      heading: "Resource Sharing",
      content: `Creating platforms for owners to share beneficial resources and services`,
      image: "/owner-club/meeting3.png",
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // for smooth scrolling
    });
  }, []);

  return (
    <div className="w-full px-6 sm:px-16 md:px-20 lg:px-32 xl:px-40 2xl:px-64 py-6 md:py-12 pt-28 md:pt-28">
      <div className="text-left max-w-4xl mx-auto">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
          iProp91 Owners' Club
        </h1>
        <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed mb-6">
          iProp91 Owners' Club fosters a secure, collaborative environment for owners, 
          protecting their interests while promoting community engagement and democratic decision-making.
        </p>
        <div className="flex justify-center mb-8">
          <img
            src="/owner-club/oc1.png"
            alt="Owners club illustration"
            className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mx-auto"
          />
        </div>
      </div>

      <div className="space-y-12 md:space-y-16 max-w-6xl mx-auto">
        <OwnerCard
          title="Ownership Verification Process"
          description={ownershipVerificiationDiscription}
          list={ownershipVerificiation}
          imageNumber="oc2"
          imageMaxWidth="300px"
        />

        <OwnerCard
          title="Meeting Other Owners of the Project"
          description={meetingOwnersDiscription}
          list={meetingOwners}
          imageNumber="oc3"
          imageMaxWidth="300px"
        />

        <OwnerCard
          title="Hiding Personally Identifiable Information"
          description={hidingPersonalityDiscription}
          list={hidingPersonality}
          imageNumber="four"
          imageMaxWidth="300px"
        />

        <OwnerCard
          title="No Spam Communication"
          description={noSpamDiscription}
          list={noSpam}
          imageNumber="oc5"
          imageMaxWidth="300px"
        />

        <OwnerCard
          title="RWA Structure for Achieving Common Goals"
          description={rwaStructureDiscription}
          list={rwaStructure}
          imageNumber="oc6"
          imageMaxWidth="300px"
        />

        <OwnerCard
          title="Coordinated Meetings Before Possession"
          description={coordinatedNeetingsDiscription}
          list={coordinatedNeetings}
          imageNumber="oc7"
          imageMaxWidth="300px"
        />
      </div>

      <div className="mt-8 md:mt-12 max-w-4xl mx-auto">
        <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
          In conclusion, a closed club for verified owners significantly enhances the ownership 
          experience by fostering community, ensuring privacy, and promoting collaboration. 
          These features create a supportive environment that empowers owners to achieve common goals.
        </p>
      </div>
    </div>
  );
};

export default ServicesOwnerClub;