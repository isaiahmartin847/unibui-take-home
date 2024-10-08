"use server";

import JobLocation from "@/app/components/jobPage/jobLocation";
import JobPageItem from "@/app/components/jobPage/jobPageItem";
import Navbar from "@/app/components/Navbar/Navbar";
import { Job } from "@/app/types";

// Documentation for this component can be found at:
// /docs/components_&_pages/job_page.md

interface ApiResponse {
  job: Job[];
}

interface Props {
  params: {
    id: string;
  };
}

async function getJob(id: string): Promise<Job> {
  const res = await fetch(`http://localhost:3000/api/job/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch job: ${res.status} ${res.statusText}`);
  }

  const data: ApiResponse = await res.json();
  if (!data.job || data.job.length === 0) {
    throw new Error("No job data found");
  }
  return data.job[0];
}

const Page = async ({ params }: Props) => {
  try {
    const job = await getJob(params.id);

    return (
      <div>
        <Navbar
          filter={false}
          linkName="Home"
          title="Job Details"
          url="/"
        />

        <JobPageItem
          city={job.city}
          companyName={job.companyName}
          id={job.id}
          jobDescription={job.jobDescription}
          jobTitle={job.jobTitle}
          requirements={job.requirements}
          state={job.state}
          key={job.id}
        />

        <JobLocation
          city={job.city}
          state={job.state}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching or rendering job:", error);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>
          Sorry, we couldn&apos;t load the job details. Please try again later.
        </p>
      </div>
    );
  }
};

export default Page;
