import { useEffect, useState } from "react";
import JobForm from "./JobForm";
import JobCard from "./JobCard";

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortOption, setSortOption] = useState("newest");
    const [addingJob, setAddingJob] = useState(null);
    const [updatingJob, setUpdatingJob] = useState(null);
    const [deletingJob, setDeletingJob] = useState(null);
    const [formResetKey, setFormResetKey] = useState(0);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });
    const [viewMode, setViewMode] = useState("cards");
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 6;

    useEffect(() => {
        const savedJobs = localStorage.getItem("jobApplications");

        if (savedJobs) {
            setJobs(JSON.parse(savedJobs));
        }

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("jobApplications", JSON.stringify(jobs));
        }
    }, [jobs, isLoaded]);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, sortOption]);

    function addJob(application) {
        setAddingJob(application);
    }

    function confirmAddJob() {
        setJobs((currentJobs) => [
            ...currentJobs,
            {
                id: Date.now(),
                ...addingJob,
            },
        ]);

        setAddingJob(null);
        setFormResetKey((key) => key + 1);
    }

    function deleteJob(id) {
        setJobs((currentJobs) =>
            currentJobs.filter((job) => job.id !== id)
        );

        setDeletingJob(null);
    }

    function requestUpdate(application) {
        setUpdatingJob(application);
    }

    function confirmUpdateJob() {
        setJobs((currentJobs) =>
            currentJobs.map((job) =>
                job.id === editingJob.id
                    ? {
                        ...job,
                        ...updatingJob,
                    }
                    : job
            )
        );

        setEditingJob(null);
        setUpdatingJob(null);
        setFormResetKey((key) => key + 1);
    }

    const filteredJobs = jobs
    .filter((job) => {
        const matchesSearch =
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.position.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
        if (sortOption === "newest") {
            return new Date(b.dateApplied) - new Date(a.dateApplied);
        }

        if (sortOption === "oldest") {
            return new Date(a.dateApplied) - new Date(b.dateApplied);
        }

        if (sortOption === "companyAZ") {
            return a.company.localeCompare(b.company);
        }

        if (sortOption === "positionAZ") {
            return a.position.localeCompare(b.position);
        }

        return 0;
    });

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    const currentJobs = filteredJobs.slice(
        indexOfFirstJob,
        indexOfLastJob
    );

    const totalApplications = jobs.length;

    const wishlistCount = jobs.filter(
        (job) => job.status === "Wishlist"
    ).length;

    const appliedCount = jobs.filter(
        (job) => job.status === "Applied"
    ).length;

    const interviewCount = jobs.filter(
        (job) => job.status === "Interview"
    ).length;

    const offerCount = jobs.filter(
        (job) => job.status === "Offer"
    ).length;

    const rejectedCount = jobs.filter(
        (job) => job.status === "Rejected"
    ).length;

    return (
        <main>
            <div className="dashboard-header">
                <div>
                    <p className="dashboard-label">JOB APPLICATION TRACKER</p>

                    <h2>Manage your job search</h2>

                    <p>
                        Keep track of your applications, interviews,
                        offers, and opportunities in one place.
                    </p>
                </div>

                <button
                    className="theme-toggle"
                    onClick={() => setDarkMode((current) => !current)}
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </div>

            <div className="statistics">
                <div className="stat-card">
                    <h3>{totalApplications}</h3>
                    <p>Total Applications</p>
                </div>

                <div className="stat-card">
                    <h3>{wishlistCount}</h3>
                    <p>Wishlist</p>
                </div>

                <div className="stat-card">
                    <h3>{appliedCount}</h3>
                    <p>Applied</p>
                </div>

                <div className="stat-card">
                    <h3>{interviewCount}</h3>
                    <p>Interview</p>
                </div>

                <div className="stat-card">
                    <h3>{offerCount}</h3>
                    <p>Offers</p>
                </div>

                <div className="stat-card">
                    <h3>{rejectedCount}</h3>
                    <p>Rejected</p>
                </div>
            </div>

            <JobForm
                key={formResetKey}
                onAddJob={addJob}
                editingJob={editingJob}
                onUpdateJob={requestUpdate}
                onCancelEdit={() => setEditingJob(null)}
            />

           <div className="job-filters">
                <div className="search-box">
                    <span className="search-icon">⌕</span>

                    <input
                        type="text"
                        placeholder="Search company or position..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                <div className="filter-group">

                    <div className="filter-control">
                        <label>Status</label>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Wishlist">Wishlist</option>
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="filter-control">
                        <label>Sort by</label>

                        <select
                            value={sortOption}
                            onChange={(event) => setSortOption(event.target.value)}
                        >
                            <option value="newest">Newest Applied</option>
                            <option value="oldest">Oldest Applied</option>
                            <option value="companyAZ">Company A–Z</option>
                            <option value="positionAZ">Position A–Z</option>
                        </select>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={viewMode === "cards" ? "active" : ""}
                            onClick={() => setViewMode("cards")}
                        >
                            ▦ Cards
                        </button>

                        <button
                            className={viewMode === "table" ? "active" : ""}
                            onClick={() => setViewMode("table")}
                        >
                            ☷ Table
                        </button>
                    </div>
                </div>
            </div>

           <div className={viewMode === "table" ? "job-table-container" : "job-list"}>
                {jobs.length === 0 ? (
                    <p>No job applications yet. Add your first application above.</p>
                ) : viewMode === "cards" ? (
                    currentJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            company={job.company}
                            position={job.position}
                            dateApplied={job.dateApplied}
                            status={job.status}
                            jobUrl={job.jobUrl}
                            notes={job.notes}
                            onEdit={() => setEditingJob(job)}
                            onDelete={() => setDeletingJob(job)}
                        />
                    ))
                ) : (
                    <table className="job-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Date Applied</th>
                                <th>Status</th>
                                <th>Job Link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentJobs.map((job) => (
                                <tr key={job.id}>
                                    <td>{job.company}</td>

                                    <td>{job.position}</td>

                                    <td>{job.dateApplied}</td>

                                    <td>
                                        <span className={`table-status ${job.status.toLowerCase()}`}>
                                            {job.status}
                                        </span>
                                    </td>

                                    <td>
                                        {job.jobUrl ? (
                                            <a
                                                href={job.jobUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Job
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    <td className="table-actions">
                                        <button
                                            onClick={() => setEditingJob(job)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => setDeletingJob(job)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() =>
                            setCurrentPage((page) => Math.max(page - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>

                    <span>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.min(page + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            )}

            {addingJob && (
                <div className="add-modal-overlay">
                    <div className="add-modal">
                        <div className="add-modal-icon">
                            +
                        </div>

                        <h3>Add Application?</h3>

                        <p>
                            Are you sure you want to add this job application?
                        </p>

                        <div className="add-job-preview">
                            <strong>{addingJob.position}</strong>
                            <span>{addingJob.company}</span>
                        </div>

                        <div className="add-modal-actions">
                            <button
                                className="cancel-add-btn"
                                onClick={() => setAddingJob(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-add-btn"
                                onClick={confirmAddJob}
                            >
                                Add Application
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {updatingJob && (
                <div className="update-modal-overlay">
                    <div className="update-modal">
                        <div className="update-modal-icon">
                            ?
                        </div>

                        <h3>Update Application?</h3>

                        <p>
                            Are you sure you want to save these changes?
                        </p>

                        <div className="update-job-preview">
                            <strong>{updatingJob.position}</strong>
                            <span>{updatingJob.company}</span>
                        </div>

                        <div className="update-modal-actions">
                            <button
                                className="cancel-update-btn"
                                onClick={() => setUpdatingJob(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-update-btn"
                                onClick={confirmUpdateJob}
                            >
                                Update Application
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deletingJob && (
                    <div className="delete-modal-overlay">
                        <div className="delete-modal">
                            <div className="delete-modal-icon">
                                !
                            </div>

                            <h3>Delete Application?</h3>

                            <p>
                                Are you sure you want to delete this application?
                            </p>

                            <div className="delete-job-preview">
                                <strong>{deletingJob.position}</strong>
                                <span>{deletingJob.company}</span>
                            </div>

                            <p className="delete-warning">
                                This action cannot be undone.
                            </p>

                            <div className="delete-modal-actions">
                                <button
                                    className="cancel-delete-btn"
                                    onClick={() => setDeletingJob(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="confirm-delete-btn"
                                    onClick={() => deleteJob(deletingJob.id)}
                                >
                                    Delete Application
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </main>
    );
}

export default Dashboard;