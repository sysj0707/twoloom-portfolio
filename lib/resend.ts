import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInquiryEmail = async (data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) => {
  try {
    // 관리자에게 알림 이메일 발송
    const adminEmail = await resend.emails.send({
      from: 'noreply@twoloom.com',
      to: ['one@twoloom.com'],
      subject: `[Two Loom] 새로운 문의: ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">새로운 문의사항이 접수되었습니다</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>문의자 정보</h3>
            <p><strong>이름:</strong> ${data.name}</p>
            <p><strong>이메일:</strong> ${data.email}</p>
            ${data.company ? `<p><strong>회사:</strong> ${data.company}</p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3>문의 내용</h3>
            <p style="white-space: pre-line;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b;">
            <p>이 이메일은 Two Loom 포트폴리오 사이트에서 자동으로 발송되었습니다.</p>
          </div>
        </div>
      `,
    });

    // 고객에게 접수 확인 이메일 발송
    const customerEmail = await resend.emails.send({
      from: 'noreply@twoloom.com',
      to: [data.email],
      subject: '[Two Loom] 문의사항이 접수되었습니다',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">문의사항 접수 확인</h2>
          
          <p>안녕하세요 <strong>${data.name}</strong>님,</p>
          
          <p>Two Loom에 문의해 주셔서 감사합니다. 고객님의 문의사항이 정상적으로 접수되었습니다.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>접수된 문의 내용</h3>
            <p style="white-space: pre-line;">${data.message}</p>
          </div>
          
          <p>빠른 시일 내에 담당자가 확인 후 연락드리겠습니다.</p>
          
          <div style="margin-top: 30px; padding: 20px; background: #6366F1; color: white; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: white;">Two Loom</h3>
            <p style="margin: 0;">혁신적인 AI 기술로 더 나은 소프트웨어를 만듭니다.</p>
            <p style="margin: 10px 0 0 0;">문의: one@twoloom.com</p>
          </div>
        </div>
      `,
    });

    return { success: true, adminEmail, customerEmail };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};