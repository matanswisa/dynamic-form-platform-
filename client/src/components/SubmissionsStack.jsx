import { useEffect, useState } from "react";
import { fetchSubmissions } from "../services/api";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function SubmissionsStack() {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        fetchSubmissions().then((res) => {
            setSubmissions(res);
        });
    }, []);

    return (
        <Box sx={{ p: 2, maxHeight: 640, overflowY: 'auto' }}>
            <Stack spacing={1.5}>
                {submissions?.length ? submissions.map((submission) => (
                    <Accordion key={submission.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                    {submission.form_type || `Submission #${submission.id}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Submission #{submission.id}
                                </Typography>
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Stack spacing={1}>
                                {Object.entries(submission.data).map(([key, value]) => (
                                    <Typography key={key}>
                                        <strong>{key}</strong>: {value?.toString()}
                                    </Typography>
                                ))}
                                <Typography variant="caption" color="text.secondary">
                                    Submitted at:{" "}
                                    {new Date(submission.submitted_at).toLocaleString()}
                                </Typography>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                )) : (
                    <Box sx={{ p: 3, border: '1px dashed #cbd5e1', borderRadius: 2, color: 'text.secondary' }}>
                        <Typography sx={{ fontWeight: 700 }}>No submissions yet</Typography>
                        <Typography variant="body2">Submit a form to see the saved payload here.</Typography>
                    </Box>
                )}
            </Stack>
        </Box>
    );
}
