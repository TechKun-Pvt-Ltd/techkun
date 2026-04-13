import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend("re_L3T6qVsk_22YMdkPYLiYtGsRfMBhL4BLK");

interface EmailRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  services: string[];
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email, phone, message, services }: EmailRequest = await req.json();

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, msg: 'All fields are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: 'musharaf.infomover@gmail.com',
      replyTo: email,
      subject: `New Contact Form Submission - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f6f9fc">
              <tr>
                <td style="padding: 40px 0;">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 30px; background-color: #1a1a1a; border-radius: 10px 10px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                        <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 16px;">You have received a new inquiry</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 30px;">
                              <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 20px;">Contact Details</h2>
                              
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 8px; margin-bottom: 20px;">
                                <tr>
                                  <td style="padding: 20px;">
                                    <p style="margin: 0 0 10px 0;"><strong style="color: #4b5563;">Name:</strong> <span style="color: #1a1a1a;">${name}</span></p>
                                    <p style="margin: 0 0 10px 0;"><strong style="color: #4b5563;">Email:</strong> <span style="color: #1a1a1a;">${email}</span></p>
                                    <p style="margin: 0;"><strong style="color: #4b5563;">Phone:</strong> <span style="color: #1a1a1a;">${phone}</span></p>
                                  </td>
                                </tr>
                              </table>
                              
                              ${services.length > 0 ? `
                              <h2 style="color: #1a1a1a; margin: 30px 0 20px 0; font-size: 20px;">Services Interested In</h2>
                              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #1a1a1a;">
                                  ${services.map(service => `<span style="background-color: #e5e7eb; padding: 6px 12px; border-radius: 15px; font-size: 14px; margin-right: 8px; display: inline-block; margin-bottom: 8px;">${service}</span>`).join('')}
                                </p>
                              </div>
                              ` : ''}
                              
                              <h2 style="color: #1a1a1a; margin: 30px 0 20px 0; font-size: 20px;">Message</h2>
                              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                                <p style="margin: 0; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                          This message was sent from your contact form.<br>
                          © ${new Date().getFullYear()} Tech-Kun
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, msg: 'Failed to send email.', error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      msg: 'Email sent successfully!', 
      data 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, msg: 'Failed to send email.' },
      { status: 500 }
    );
  }
}