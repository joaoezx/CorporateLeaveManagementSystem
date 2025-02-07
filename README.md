<h1>Corporate Leave Management System</h1>

<h3>The Corporate Leave Management System allows employees to request leaves through a system that automates the approval process and tracks remaining leave balances.</h3>

<h2>Installation and Dependencies</h3>

<ul>

<li>npm install @types/node @nestjs/common @nestjs/core</li>

npm install chance

<li>Used for testing: npm install typeorm @nestjs/typeorm sqlite3</li>

<li>npm install @nestjs/jwt</li>

<li>npm install class-validator class-transformer</li>

<li>npm install jest ts-jest @nestjs/testing @types/jest supertest</li>

<li>Used at the end of project: npm install mongoose @nestjs/mongoose</li>

</ul>

<h2>Features</h2>

<ul>

<li>User Management: API to create and manage users.</li>

<li>Authentication: Secure login system using JWT authentication.</li>

<li>Leave Requests: Employees can request leave with details like start date, end date, and type of leave.</li>

<li>Approval System: Requests go through approval stages (Pending, Approved, Rejected).</li>

<li>Leave Policy: Defines company rules, such as 20 annual leaves per employee.</li>

<li>Notifications: Sends email notifications for approvals and rejections.</li>

<li>Reports: Generates reports on leave history, including start and end dates.</li>

</ul>
