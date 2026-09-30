import { useEffect, useState } from "react";

function JobForm({
    onAddJob,
    editingJob,
    onUpdateJob,
    onCancelEdit,
}) {
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [dateApplied, setDateApplied] = useState("");
    const [status, setStatus] = useState("Wishlist");
    const [jobUrl, setJobUrl] = useState("");
    const [notes, setNotes] = useState("");

    const isEditing = editingJob !== null;

    useEffect(() => {
        if (editingJob) {
            setCompany(editingJob.company);
            setPosition(editingJob.position);
            setDateApplied(editingJob.dateApplied);
            setStatus(editingJob.status);
            setJobUrl(editingJob.jobUrl);
            setNotes(editingJob.notes);
        }
    }, [editingJob]);

    function handleSubmit(event) {
        event.preventDefault();

       const application = {
            company,
            position,
            dateApplied,
            status,
            jobUrl,
            notes,
        };

        if (isEditing) {
            onUpdateJob(application);
        } else {
            onAddJob(application);
        }

        setCompany("");
        setPosition("");
        setDateApplied("");
        setStatus("Wishlist");
        setJobUrl("");
        setNotes("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isEditing ? "Edit Job Application" : "Add Job Application"}</h2>

            <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
            />

            <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
            />

            <input
                type="date"
                value={dateApplied}
                onChange={(event) => setDateApplied(event.target.value)}
            />

            <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
            >
                <option>Wishlist</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
            </select>

            <input
                type="url"
                placeholder="Job URL"
                value={jobUrl}
                onChange={(event) => setJobUrl(event.target.value)}
            />

            <textarea
                placeholder="Notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
            />

            <div className="form-actions">
                <button type="submit">
                    {isEditing ? "Update Application" : "Add Application"}
                </button>

                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default JobForm;