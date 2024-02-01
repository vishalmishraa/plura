datasource db {
    provider     = "mysql"
    url          = env("DATABASE_URL")
    relationMode = "prisma"
  }
  
  generator client {
    provider = "prisma-client-js"
  }
  
  enum Role {
    AGENCY_OWNER
    AGENCY_ADMIN
    SUBACCOUNT_USER
    SUBACCOUNT_GUEST
  }
  
  enum Icon {
    settings
    chart
    calendar
    check
    chip
    compass
    database
    flag
    home
    info
    link
    lock
    messages
    notification
    payment
    power
    receipt
    shield
    star
    tune
    videorecorder
    wallet
    warning
    headphone
    send
    pipelines
    person
    category
    contact
    clipboardIcon
  }
  
  model User {
    id           String         @id @default(uuid())
    name         String
    avatarUrl    String         @db.Text
    email        String         @unique
    createdAt    DateTime       @default(now())
    updatedAt    DateTime       @updatedAt
    role         Role           @default(SUBACCOUNT_USER)
    agencyId     String?
    Agency       Agency?        @relation(fields: [agencyId], references: [id], onDelete: Cascade)
    Permissions  Permissions[]
    Ticket       Ticket[]
    Notification Notification[]
  
    @@index([agencyId])
  }
  
  model Permissions {
    id           String     @id @default(uuid())
    email        String
    User         User       @relation(fields: [email], references: [email], onDelete: Cascade)
    subAccountId String
    SubAccount   SubAccount @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    access       Boolean
  
    @@index([subAccountId])
    @@index([email])
  }
  
  model Agency {
    id               String                @id @default(uuid())
    connectAccountId String?               @default("")
    customerId       String                @default("")
    name             String
    agencyLogo       String                @db.Text
    companyEmail     String                @db.Text
    companyPhone     String
    whiteLabel       Boolean               @default(true)
    address          String
    city             String
    zipCode          String
    state            String
    country          String
    goal             Int                   @default(5)
    users            User[]
    createdAt        DateTime              @default(now())
    updatedAt        DateTime              @updatedAt
    SubAccount       SubAccount[]
    SidebarOption    AgencySidebarOption[]
    Invitation       Invitation[]
    Notification     Notification[]
    Subscription     Subscription?
    AddOns           AddOns[]
  }
  
  model SubAccount {
    id               String                    @id @default(uuid())
    connectAccountId String?                   @default("")
    name             String
    subAccountLogo   String                    @db.Text
    createdAt        DateTime                  @default(now())
    updatedAt        DateTime                  @updatedAt
    companyEmail     String                    @db.Text
    companyPhone     String
    goal             Int                       @default(5)
    address          String
    city             String
    zipCode          String
    state            String
    country          String
    agencyId         String
    Agency           Agency                    @relation(fields: [agencyId], references: [id], onDelete: Cascade)
    SidebarOption    SubAccountSidebarOption[]
    Permissions      Permissions[]
    Funnels          Funnel[]
    Media            Media[]
    Contact          Contact[]
    Trigger          Trigger[]
    Automation       Automation[]
    Pipeline         Pipeline[]
    Tags             Tag[]
    Notification     Notification[]
  
    @@index([agencyId])
  }
  
  model Tag {
    id           String   @id @default(uuid())
    name         String
    color        String
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    subAccountId String
  
    SubAccount SubAccount @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    Ticket     Ticket[]
  
    @@index([subAccountId])
  }
  
  model Pipeline {
    id           String     @id @default(uuid())
    name         String
    createdAt    DateTime   @default(now())
    updatedAt    DateTime   @updatedAt
    Lane         Lane[]
    SubAccount   SubAccount @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    subAccountId String
  
    @@index([subAccountId])
  }
  
  model Lane {
    id         String   @id @default(uuid())
    name       String
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
    Pipeline   Pipeline @relation(fields: [pipelineId], references: [id], onDelete: Cascade)
    pipelineId String
    Tickets    Ticket[]
    order      Int      @default(0)
  
    @@index([pipelineId])
  }
  
  model Ticket {
    id          String   @id @default(uuid())
    name        String
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    laneId      String
    order       Int      @default(0)
    Lane        Lane     @relation(fields: [laneId], references: [id], onDelete: Cascade)
    value       Decimal?
    description String?
    Tags        Tag[]
  
    customerId String?
    Customer   Contact? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
    assignedUserId String?
    Assigned       User?   @relation(fields: [assignedUserId], references: [id], onDelete: SetNull)
  
    @@index([laneId])
    @@index([customerId])
    @@index([assignedUserId])
  }
  
  enum TriggerTypes {
    CONTACT_FORM
  }
  
  model Trigger {
    id           String       @id @default(uuid())
    name         String
    type         TriggerTypes
    createdAt    DateTime     @default(now())
    updatedAt    DateTime     @updatedAt
    subAccountId String
    Subaccount   SubAccount   @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    Automations  Automation[]
  
    @@index([subAccountId])
  }
  
  model Automation {
    id                 String               @id @default(uuid())
    name               String
    createdAt          DateTime             @default(now())
    updatedAt          DateTime             @updatedAt
    triggerId          String?
    published          Boolean              @default(false)
    Trigger            Trigger?             @relation(fields: [triggerId], references: [id], onDelete: Cascade)
    subAccountId       String
    Subaccount         SubAccount           @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    Action             Action[]
    AutomationInstance AutomationInstance[]
  
    @@index([triggerId])
    @@index([subAccountId])
  }
  
  model AutomationInstance {
    id           String     @id @default(uuid())
    createdAt    DateTime   @default(now())
    updatedAt    DateTime   @updatedAt
    automationId String
    Automation   Automation @relation(fields: [automationId], references: [id], onDelete: Cascade)
    active       Boolean    @default(false)
  
    @@index([automationId])
  }
  
  enum ActionType {
    CREATE_CONTACT
  }
  
  model Action {
    id           String     @id @default(uuid())
    name         String
    type         ActionType
    createdAt    DateTime   @default(now())
    updatedAt    DateTime   @updatedAt
    automationId String
    order        Int
    Automation   Automation @relation(fields: [automationId], references: [id], onDelete: Cascade)
    laneId       String     @default("0")
  
    @@index([automationId])
  }
  
  model Contact {
    id           String   @id @default(uuid())
    name         String
    email        String
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    subAccountId String
  
    Subaccount SubAccount @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    Ticket     Ticket[]
  
    @@index([subAccountId])
  }
  
  model Media {
    id           String     @id @default(uuid())
    type         String?
    name         String
    link         String     @unique
    subAccountId String
    createdAt    DateTime   @default(now())
    updatedAt    DateTime   @updatedAt
    Subaccount   SubAccount @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
  
    @@index([subAccountId])
  }
  
  model Funnel {
    id            String       @id @default(uuid())
    name          String
    createdAt     DateTime     @default(now())
    updatedAt     DateTime     @updatedAt
    description   String?
    published     Boolean      @default(false)
    subDomainName String?      @unique
    favicon       String?      @db.Text
    subAccountId  String
    SubAccount    SubAccount   @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    FunnelPages   FunnelPage[]
    liveProducts  String?      @default("[]")
    ClassName     ClassName[]
  
    @@index([subAccountId])
  }
  
  model ClassName {
    id         String   @id @default(uuid())
    name       String
    color      String
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
    funnelId   String
    customData String?  @db.LongText
    Funnel     Funnel   @relation(fields: [funnelId], references: [id], onDelete: Cascade)
  
    @@index([funnelId])
  }
  
  model FunnelPage {
    id           String   @id @default(uuid())
    name         String
    pathName     String   @default("")
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    visits       Int      @default(0)
    content      String?  @db.LongText
    order        Int
    previewImage String?  @db.Text
    funnelId     String
    Funnel       Funnel   @relation(fields: [funnelId], references: [id], onDelete: Cascade)
  
    @@index([funnelId])
  }
  
  model AgencySidebarOption {
    id        String   @id @default(uuid())
    name      String   @default("Menu")
    link      String   @default("#")
    icon      Icon     @default(info)
    agencyId  String
    Agency    Agency?  @relation(fields: [agencyId], references: [id], onDelete: Cascade)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  
    @@index([agencyId])
  }
  
  model SubAccountSidebarOption {
    id           String      @id @default(uuid())
    name         String      @default("Menu")
    link         String      @default("#")
    icon         Icon        @default(info)
    createdAt    DateTime    @default(now())
    updatedAt    DateTime    @updatedAt
    SubAccount   SubAccount? @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
    subAccountId String?
  
    @@index([subAccountId])
  }
  
  enum InvitationStatus {
    ACCEPTED
    REVOKED
    PENDING
  }
  
  model Invitation {
    id       String           @id @default(uuid())
    email    String           @unique
    agencyId String
    Agency   Agency           @relation(fields: [agencyId], references: [id], onDelete: Cascade)
    status   InvitationStatus @default(PENDING)
    role     Role             @default(SUBACCOUNT_USER)
  
    @@index([agencyId])
  }
  
  model Notification {
    id           String  @id @default(uuid())
    notification String
    agencyId     String
    subAccountId String?
    userId       String
  
    User       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
    Agency     Agency      @relation(fields: [agencyId], references: [id], onDelete: Cascade)
    SubAccount SubAccount? @relation(fields: [subAccountId], references: [id], onDelete: Cascade)
  
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  
    @@index([agencyId])
    @@index([subAccountId])
    @@index([userId])
  }
  
  enum Plan {
    price_1OYxkqFj9oKEERu1NbKUxXxN
    price_1OYxkqFj9oKEERu1KfJGWxgN
  }
  
  model Subscription {
    id        String   @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    plan      Plan?
    price     String?
    active    Boolean  @default(false)
  
    priceId              String
    customerId           String
    currentPeriodEndDate DateTime
    subscritiptionId     String   @unique
  
    agencyId String? @unique
    Agency   Agency? @relation(fields: [agencyId], references: [id])
  
    @@index([customerId])
  }
  
  model AddOns {
    id        String   @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    name      String
    active    Boolean  @default(false)
    priceId   String   @unique
    agencyId  String?
    Agency    Agency?  @relation(fields: [agencyId], references: [id])
  
    @@index([agencyId])
  }