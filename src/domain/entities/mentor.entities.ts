export default interface IApplication {
    name      :   string
    email     :   string   
    password  :   string
    avatar    :   string|null
    country   :   string
    language  :   string
    mentorRole :  string
    description :  string
    resume     :  string
    userId     :  string
    isVerified? :  boolean
    isBlocked?  :  boolean
    followers?  :  string[]
    following?  :  string[]
    ratings?    :  string[]
}
