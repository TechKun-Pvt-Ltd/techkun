'use client'
import Banner from "@/app/sections/Banner";
import Cofounders from "@/app/sections/Cofounders";
import ContactUs from "@/app/sections/ContactUs";
import MeetTechKun from "@/app/sections/MeetTechKun";
import ProblemStatement from "@/app/sections/ProblemStatement";
import SolutionStatement from "@/app/sections/SolutionStatement";
import PhotoList from "@/components/PhotoList";
import CursorDemo from "@/components/CursorDemo";

export default function Main() {
    return <main>
        <Banner />
        <section>
            <PhotoList />
            <CursorDemo />
        </section>
        <ProblemStatement />
        <SolutionStatement />
        <MeetTechKun />
        <Cofounders />
        <ContactUs />
    </main>;
}