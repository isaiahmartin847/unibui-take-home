import JobItem from "./components/jobList/jobItem";
import Navbar from "./components/Navbar/Navbar";
import { Job } from "./types";

export const revalidate = 0;
export const dynamic = "force-dynamic";

// Documentation for this component can be found at:
// /docs/components_&_pages/job_list_page.md

async function fetchJobs(params: {
  state?: string;
  title?: string;
  city?: string;
}) {
  const queryParams = new URLSearchParams(params as Record<string, string>);

  try {
    const response = await fetch(
      `http://localhost:3000/api/job?${queryParams.toString()}`,
      {
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch job listings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: error,
      status: "error",
      message: "Failed to fetch job listings",
    };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { state?: string; title?: string; city?: string };
}) {
  const { state, title, city } = searchParams;

  const { jobs, status, message } = await fetchJobs({ state, title, city });

  if (status === "error") {
    return (
      <div>
        <Navbar
          filter={true}
          linkName="Saved Jobs"
          title="Jobs"
          url="/saved-jobs"
        />
        <div className="text-center text-2xl mt-5 text-red-600">{message}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        filter={true}
        linkName="Saved Jobs"
        title="Jobs"
        url="/saved-jobs"
      />
      <ul>
        {jobs.length > 0 ? (
          jobs.map((job: Job) => (
            <JobItem
              city={job.city}
              company={job.companyName}
              id={job.id}
              state={job.state}
              title={job.jobTitle}
              key={job.id}
            />
          ))
        ) : (
          <div className="text-center text-2xl mt-5">No Jobs Found.</div>
        )}
      </ul>
    </div>
  );
}
