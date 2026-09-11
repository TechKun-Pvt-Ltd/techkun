'use client'
import Banner from "@/app/sections/01_Banner/section.tsx";
import ProblemStatement from "@/app/sections/02_Problem_Statement/section.tsx";
import OurPrinciples from "@/app/sections/03_Our_Principles/section.tsx";
import MeetTechKun from "@/app/sections/04_Meet_TechKun/section.tsx";
import Cofounders from "@/app/sections/05_Cofounders/section.tsx";
import ContactUs from "@/app/sections/06_Contact_Us/section.tsx";

export default function Main() {
    return <main>
        <Banner />
        <ProblemStatement />
        <OurPrinciples />
        <MeetTechKun />
        <Cofounders />
        <ContactUs />
    </main>;
}