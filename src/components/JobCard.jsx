function JobCard({
    company,
    position,
    dateApplied,
    status,
    jobUrl,
    notes,
    onEdit,
    onDelete,
}) {
    return (
        <div className="job-card">
            <h3>{position}</h3>

            <p>{company}</p>

            <p>Applied: {dateApplied}</p>

            {jobUrl && (
                <p>
                    <a
                        href={jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Job Posting
                    </a>
                </p>
            )}

            {notes && (
                <p>
                    <strong>Notes:</strong> {notes}
                </p>
            )}

            <span className={`status-${status.toLowerCase()}`}>
                {status}
            </span>

            <div className="job-actions">
                <button
                    type="button"
                    onClick={onEdit}
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => {
                        const confirmed = window.confirm(
                            "Are you sure you want to delete this application?"
                        );

                        if (confirmed) {
                            onDelete();
                        }
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default JobCard;