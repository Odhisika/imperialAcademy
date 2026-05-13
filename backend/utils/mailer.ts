import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendApprovalEmail = async (to: string, parentName: string, childName: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Admission Approved - Imperial Academy',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #00236F;">Imperial Academy</h1>
                </div>
                <p>Dear <strong>${parentName}</strong>,</p>
                <p>We are pleased to inform you that the admission application for <strong>${childName}</strong> has been <strong>Approved</strong>!</p>
                <p>Welcome to the Imperial Academy family. We are excited to have you join our community.</p>
                <p>Please visit the school administration office within the next 5 working days to complete the final registration process and collect the admission package.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0;">Next Steps:</h4>
                    <ul style="padding-left: 20px;">
                        <li>Bring original birth certificate of the student.</li>
                        <li>Provide 2 recent passport-sized photographs.</li>
                        <li>Pay the non-refundable registration fee.</li>
                    </ul>
                </div>
                <p>If you have any questions, please feel free to contact us at 0243701207 or reply to this email.</p>
                <p>Best regards,<br><strong>The Admissions Team</strong><br>Imperial Academy</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888; text-align: center;">Building Strong Foundations for the Future Since 2007</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Approval email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Failed to send approval email to ${to}:`, error);
        // We don't throw here to avoid breaking the status update if email fails
        // but in a production app, you might want to handle this differently
    }
};
