export const runtime = "edge";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      <header className="px-6 lg:px-12 h-16 flex items-center justify-between border-b border-[#eaeaea] bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center gap-2 group" href="/">
          <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center transition-transform group-hover:scale-110">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white"
            >
              <path
                d="M7.5 0L15 15H0L7.5 0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tighter text-black">
            CHATTERBOX
          </span>
        </Link>
        <nav className="flex gap-8 items-center">
          <Link className="text-sm font-medium text-[#666666] hover:text-black transition-colors" href="/login">
            Log In
          </Link>
          <Link 
            className="text-sm font-medium bg-black text-white hover:bg-[#171717] px-4 py-2 rounded-md transition-colors" 
            href="/signup"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">TERMS OF SERVICE</h1>
        <p className="text-[#666666] mb-12">Last Updated: January 4, 2026</p>

        <div className="space-y-12 text-[#171717]">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. ACCEPTANCE OF TERMS</h2>
            <p className="leading-relaxed text-[#666666]">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Chatterbox Enterprises USA LLC ("Chatterbox," "we," "us," or "our") governing your access to and use of the Chatterbox platform, including our website, applications, and services (collectively, the "Services").
            </p>
            <p className="leading-relaxed text-[#666666] mt-4">
              By accessing or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. ELIGIBILITY AND ACCOUNT REGISTRATION</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">2.1 Age Requirements</h3>
                <p className="leading-relaxed text-[#666666]">
                  You must be at least 13 years of age to use the Services. By using the Services, you represent and warrant that you meet this age requirement. If you are under 18, you represent that you have reviewed these Terms with your parent or legal guardian and that they agree to these Terms on your behalf.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2.2 Account Creation</h3>
                <p className="leading-relaxed text-[#666666] mb-2">
                  To access certain features of the Services, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security and confidentiality of your login credentials</li>
                  <li>Notify us immediately of any unauthorized access or security breach</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2.3 Account Types</h3>
                <p className="leading-relaxed text-[#666666]">
                  Chatterbox offers individual user accounts and workspace/organization accounts. Workspace administrators have additional rights and responsibilities as outlined in Section 8.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2.4 Prohibited Users</h3>
                <p className="leading-relaxed text-[#666666] mb-2">
                  You may not use the Services if:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>You are located in a country subject to U.S. government embargo or designated as a "terrorist supporting" country</li>
                  <li>You are listed on any U.S. government list of prohibited or restricted parties</li>
                  <li>Your previous account was terminated for violation of these Terms</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. DESCRIPTION OF SERVICES</h2>
            <p className="leading-relaxed text-[#666666] mb-4">
              Chatterbox provides a team communication and collaboration platform that includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#666666] mb-4">
              <li>Real-time messaging and chat functionality</li>
              <li>Channel-based organization</li>
              <li>Direct messaging between users</li>
              <li>File sharing and storage</li>
              <li>Search and archival features</li>
              <li>Integration with third-party services</li>
              <li>Additional features as may be added from time to time</li>
            </ul>
            <p className="leading-relaxed text-[#666666]">
              We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. USER CONTENT AND CONDUCT</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">4.1 User Content</h3>
                <p className="leading-relaxed text-[#666666]">
                  "User Content" means any data, text, files, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, links, and other content or materials you submit, post, or display on or through the Services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.2 Your Responsibilities</h3>
                <p className="leading-relaxed text-[#666666] mb-2">
                  You are solely responsible for your User Content. You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>You own or have the necessary rights, licenses, consents, and permissions to use and authorize us to use your User Content</li>
                  <li>Your User Content does not violate these Terms, applicable laws, or third-party rights</li>
                  <li>Your User Content does not contain viruses, malware, or other harmful code</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.3 Prohibited Conduct</h3>
                <p className="leading-relaxed text-[#666666] mb-2">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>Use the Services for any illegal purpose or in violation of any laws</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                  <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
                  <li>Attempt to gain unauthorized access to any portion of the Services or any systems or networks</li>
                  <li>Use automated scripts, bots, or scrapers to access the Services</li>
                  <li>Transmit any viruses, worms, defects, Trojan horses, or any items of a destructive nature</li>
                  <li>Post or transmit content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                  <li>Violate, misappropriate, or infringe the rights of others, including privacy, publicity, intellectual property, or other proprietary rights</li>
                  <li>Harvest or collect information about users without their consent</li>
                  <li>Use the Services to send spam, chain letters, or other unsolicited communications</li>
                  <li>Engage in any activity that could disable, overburden, or impair the proper functioning of the Services</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.4 Content Moderation</h3>
                <p className="leading-relaxed text-[#666666] mb-2">We reserve the right, but are not obligated, to:</p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>Monitor, review, or edit User Content</li>
                  <li>Remove or disable access to any User Content that violates these Terms</li>
                  <li>Take any action we deem necessary to protect the Services or our users</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. INTELLECTUAL PROPERTY RIGHTS</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">5.1 Our Intellectual Property</h3>
                <p className="leading-relaxed text-[#666666] mb-4">
                  The Services, including all content, features, functionality, software, code, designs, graphics, interfaces, trademarks, logos, and other materials (excluding User Content), are owned by Chatterbox or our licensors and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="leading-relaxed text-[#666666]">
                  You are granted a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Services solely for your personal or internal business purposes, subject to these Terms.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">5.2 License to Your Content</h3>
                <p className="leading-relaxed text-[#666666] mb-4">
                  By submitting User Content to the Services, you grant Chatterbox a worldwide, non-exclusive, royalty-free, transferable, sublicensable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with operating and providing the Services.
                </p>
                <p className="leading-relaxed text-[#666666]">
                  This license continues even after you stop using the Services for User Content you have shared with others who have not deleted it.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">5.3 Feedback</h3>
                <p className="leading-relaxed text-[#666666]">
                  If you provide us with any feedback, suggestions, or ideas regarding the Services ("Feedback"), you grant us the right to use such Feedback without restriction or compensation to you.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. WORKSPACE ADMINISTRATION</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">6.1 Workspace Ownership</h3>
                <p className="leading-relaxed text-[#666666]">
                  Each workspace is owned and controlled by the individual or organization that created it ("Workspace Owner"). Workspace Owners may designate administrators ("Workspace Administrators") with varying levels of control.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">6.2 Administrator Rights</h3>
                <p className="leading-relaxed text-[#666666] mb-2">Workspace Administrators have the ability to:</p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>Access, monitor, use, modify, or disclose User Content within their workspace</li>
                  <li>Manage user access and permissions</li>
                  <li>Configure workspace settings and integrations</li>
                  <li>Export workspace data</li>
                  <li>Delete the workspace and all associated data</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">6.3 Administrator Responsibilities</h3>
                <p className="leading-relaxed text-[#666666] mb-2">By accepting an administrator role, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>Comply with all applicable laws and regulations regarding user data</li>
                  <li>Use administrator privileges responsibly and only for legitimate purposes</li>
                  <li>Maintain appropriate security measures</li>
                  <li>Inform workspace members of any monitoring or data access policies</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">6.4 User Acknowledgment</h3>
                <p className="leading-relaxed text-[#666666]">
                  By joining a workspace, you acknowledge and agree that Workspace Administrators may have access to your User Content within that workspace.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. PAYMENT AND SUBSCRIPTION TERMS</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">7.1 Pricing</h3>
                <p className="leading-relaxed text-[#666666]">
                  Certain features of the Services may require payment. Current pricing is available on our website and may be changed at any time with reasonable notice.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">7.2 Billing</h3>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>Subscription fees are billed in advance on a recurring basis (monthly or annually, as selected)</li>
                  <li>You authorize us to charge your payment method for all fees owed</li>
                  <li>All fees are non-refundable except as required by law or as expressly stated in these Terms</li>
                  <li>Failure to pay may result in suspension or termination of your account</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">7.3 Free Trials</h3>
                <p className="leading-relaxed text-[#666666]">
                  We may offer free trials at our discretion. At the end of the trial period, your subscription will automatically convert to a paid subscription unless you cancel before the trial ends.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">7.4 Taxes</h3>
                <p className="leading-relaxed text-[#666666]">
                  Fees are exclusive of all taxes, levies, or duties. You are responsible for payment of all such taxes except those based on our net income.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. DATA PRIVACY AND SECURITY</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">8.1 Privacy Policy</h3>
                <p className="leading-relaxed text-[#666666]">
                  Our collection, use, and disclosure of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">8.2 Security</h3>
                <p className="leading-relaxed text-[#666666]">
                  We implement reasonable security measures to protect your data. However, no system is completely secure, and we cannot guarantee the absolute security of your information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">8.3 Data Location</h3>
                <p className="leading-relaxed text-[#666666]">
                  Your data may be processed and stored in the United States, Australia, and New Zealand. By using the Services, you consent to this transfer and processing of your data across these regions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">8.4 Data Retention</h3>
                <p className="leading-relaxed text-[#666666]">
                  We retain your User Content as long as your account is active or as needed to provide the Services. Workspace Owners may configure retention policies for their workspaces.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">8.5 Data Export</h3>
                <p className="leading-relaxed text-[#666666]">
                  You may export your User Content at any time through the Services. Workspace Administrators may export all workspace data.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. THIRD-PARTY SERVICES AND INTEGRATIONS</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">9.1 Third-Party Services</h3>
                <p className="leading-relaxed text-[#666666]">
                  The Services may integrate with or contain links to third-party websites, applications, or services ("Third-Party Services"). We do not control and are not responsible for Third-Party Services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">9.2 Your Use of Third-Party Services</h3>
                <p className="leading-relaxed text-[#666666]">
                  Your use of Third-Party Services is governed by their respective terms and privacy policies. You access Third-Party Services at your own risk.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">9.3 Data Sharing</h3>
                <p className="leading-relaxed text-[#666666]">
                  When you enable integrations with Third-Party Services, you authorize us to share your data as necessary to provide the integration functionality.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. TERM AND TERMINATION</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">10.1 Term</h3>
                <p className="leading-relaxed text-[#666666]">
                  These Terms commence when you first access the Services and continue until terminated as described herein.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">10.2 Termination by You</h3>
                <p className="leading-relaxed text-[#666666]">
                  You may terminate your account at any time by following the account deletion process in your settings or by contacting us.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">10.3 Termination by Us</h3>
                <p className="leading-relaxed text-[#666666] mb-2">
                  We may suspend or terminate your account at any time, with or without cause, with or without notice, including if:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>You violate these Terms</li>
                  <li>Your account has been inactive for an extended period</li>
                  <li>We cease providing the Services</li>
                  <li>Continuation would violate applicable law or expose us to legal liability</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">10.4 Effect of Termination</h3>
                <p className="leading-relaxed text-[#666666] mb-2">Upon termination:</p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>Your right to access and use the Services immediately ceases</li>
                  <li>We may delete your User Content, though some content may persist in backups or as required by law</li>
                  <li>We are not liable for any consequences of termination</li>
                  <li>Sections that by their nature should survive termination will continue to apply</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. DISCLAIMERS AND WARRANTIES</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">11.1 As-Is Basis</h3>
                <p className="leading-relaxed text-[#666666] uppercase">
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">11.2 No Guarantee</h3>
                <p className="leading-relaxed text-[#666666] uppercase mb-2">WE DO NOT WARRANT THAT:</p>
                <ul className="list-disc pl-6 space-y-2 text-[#666666]">
                  <li>The Services will meet your requirements or expectations</li>
                  <li>The Services will be uninterrupted, timely, secure, or error-free</li>
                  <li>The results obtained from using the Services will be accurate or reliable</li>
                  <li>Any errors in the Services will be corrected</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">11.3 Responsibility for Content</h3>
                <p className="leading-relaxed text-[#666666] uppercase">
                  WE ARE NOT RESPONSIBLE FOR ANY USER CONTENT, INCLUDING ITS ACCURACY, INTEGRITY, QUALITY, LEGALITY, OR APPROPRIATENESS. YOU ACCESS ALL USER CONTENT AT YOUR OWN RISK.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">11.4 Jurisdictional Limitations</h3>
                <p className="leading-relaxed text-[#666666] uppercase">
                  SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. LIMITATION OF LIABILITY</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">12.1 Limitation of Damages</h3>
                <p className="leading-relaxed text-[#666666] uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL CHATTERBOX, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOST PROFITS, LOST DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO USE THE SERVICES, HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">12.2 Cap on Liability</h3>
                <p className="leading-relaxed text-[#666666] uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY, OR (B) ONE HUNDRED U.S. DOLLARS ($100).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">12.3 Jurisdictional Limitations</h3>
                <p className="leading-relaxed text-[#666666] uppercase">
                  SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. INDEMNIFICATION</h2>
            <p className="leading-relaxed text-[#666666] mb-4">
              You agree to indemnify, defend, and hold harmless Chatterbox, its affiliates, and their respective officers, directors, employees, agents, suppliers, and licensors from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#666666] mb-4">
              <li>Your use of the Services</li>
              <li>Your User Content</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Your violation of any applicable laws or regulations</li>
            </ul>
            <p className="leading-relaxed text-[#666666]">
              We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. DISPUTE RESOLUTION</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">14.1 Governing Law</h3>
                <p className="leading-relaxed text-[#666666]">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Illinois, United States, without regard to its conflict of law principles.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">14.2 Informal Resolution</h3>
                <p className="leading-relaxed text-[#666666]">
                  Before filing a claim, you agree to contact us at the email address provided in Section 16 to attempt to resolve the dispute informally. We will attempt to resolve the dispute informally by contacting you via email.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">14.3 Arbitration Agreement</h3>
                <p className="leading-relaxed text-[#666666] uppercase mb-2">
                  IF THE INFORMAL RESOLUTION PROCESS DOES NOT RESOLVE THE DISPUTE WITHIN SIXTY (60) DAYS, YOU AND CHATTERBOX AGREE THAT ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES SHALL BE SETTLED BY BINDING ARBITRATION ADMINISTERED BY THE AMERICAN ARBITRATION ASSOCIATION ("AAA") IN ACCORDANCE WITH ITS COMMERCIAL ARBITRATION RULES.
                </p>
                <p className="leading-relaxed text-[#666666]">
                  The arbitration will be conducted in Chicago, Illinois or another mutually agreed location. The arbitrator's decision will be final and binding, and judgment on the award may be entered in any court having jurisdiction.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">14.4 Class Action Waiver</h3>
                <p className="leading-relaxed text-[#666666] uppercase">
                  YOU AND CHATTERBOX AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">14.5 Exceptions</h3>
                <p className="leading-relaxed text-[#666666]">
                  Notwithstanding the above, either party may bring a claim in small claims court or seek equitable relief in court to prevent infringement or misuse of intellectual property rights.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">14.6 Opt-Out</h3>
                <p className="leading-relaxed text-[#666666]">
                  You may opt out of the arbitration agreement within thirty (30) days of first accepting these Terms by sending written notice to the address provided in Section 16.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. GENERAL PROVISIONS</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">15.1 Entire Agreement</h3>
                <p className="leading-relaxed text-[#666666]">
                  These Terms, together with our Privacy Policy and any additional terms to which you agree when using specific features of the Services, constitute the entire agreement between you and Chatterbox regarding the Services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.2 Modifications</h3>
                <p className="leading-relaxed text-[#666666]">
                  We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms and updating the "Last Updated" date. Your continued use of the Services after changes become effective constitutes acceptance of the modified Terms.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.3 Waiver</h3>
                <p className="leading-relaxed text-[#666666]">
                  Our failure to enforce any provision of these Terms shall not constitute a waiver of that or any other provision.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.4 Severability</h3>
                <p className="leading-relaxed text-[#666666]">
                  If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.5 Assignment</h3>
                <p className="leading-relaxed text-[#666666]">
                  You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction. Any attempted assignment in violation of this section shall be void.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.6 Force Majeure</h3>
                <p className="leading-relaxed text-[#666666]">
                  We shall not be liable for any delay or failure to perform resulting from causes outside our reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.7 Export Control</h3>
                <p className="leading-relaxed text-[#666666]">
                  The Services may be subject to U.S. export control laws and regulations. You agree to comply with all applicable export and re-export control laws and regulations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.8 Government Use</h3>
                <p className="leading-relaxed text-[#666666]">
                  If you are a U.S. government entity, the Services are "Commercial Items" as defined at 48 C.F.R. §2.101, and the rights granted are only those rights as are granted to all other end users pursuant to these Terms.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.9 Notices</h3>
                <p className="leading-relaxed text-[#666666]">
                  We may provide notices to you via email, regular mail, or postings on the Services. Notices to us must be sent to the contact information provided in Section 16 below.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.10 No Agency</h3>
                <p className="leading-relaxed text-[#666666]">
                  Nothing in these Terms shall be construed to create a partnership, joint venture, agency, or employment relationship between you and Chatterbox.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">15.11 Third-Party Beneficiaries</h3>
                <p className="leading-relaxed text-[#666666]">
                  These Terms do not create any third-party beneficiary rights except as expressly stated herein.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">16. CONTACT INFORMATION</h2>
            <p className="leading-relaxed text-[#666666] mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-[#fafafa] border border-[#eaeaea] rounded-lg p-6 text-[#666666]">
              <p className="font-bold text-[#171717] mb-2">Chatterbox Enterprises USA LLC</p>
              <p>Address: 1441 North Statepark Way, Chicago, IL</p>
              <p>Email: <a href="mailto:hello@chatterboxteams.com" className="text-black hover:underline">hello@chatterboxteams.com</a></p>
              <p>Legal Contact: <a href="mailto:legal@chatterboxteams.com" className="text-black hover:underline">legal@chatterboxteams.com</a></p>
              <p>Website: <a href="https://www.chatterboxteams.com" className="text-black hover:underline">www.chatterboxteams.com</a></p>
            </div>
            <p className="mt-8 text-sm text-[#999999] border-t border-[#eaeaea] pt-8">
              By using Chatterbox, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </main>

      <footer className="px-6 lg:px-12 py-20 border-t border-[#eaeaea] bg-[#fafafa] text-[#666666]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white"
              >
                <path
                  d="M7.5 0L15 15H0L7.5 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-black font-bold tracking-tighter text-xl">CHATTERBOX</span>
          </div>
          <div className="flex gap-12 text-sm font-medium">
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-black transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-black transition-colors">GitHub</Link>
          </div>
          <p className="text-xs tracking-[0.2em] uppercase font-bold">© 2024 Chatterbox Inc.</p>
        </div>
      </footer>
    </div>
  );
}