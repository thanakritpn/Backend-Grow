--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-27 12:10:52

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 26070)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 916 (class 1247 OID 50494)
-- Name: CallStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CallStatus" AS ENUM (
    'RINGING',
    'ONGOING',
    'ENDED',
    'DECLINED',
    'CANCELED'
);


ALTER TYPE public."CallStatus" OWNER TO postgres;

--
-- TOC entry 895 (class 1247 OID 26210)
-- Name: CallType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CallType" AS ENUM (
    'VOICE',
    'VIDEO'
);


ALTER TYPE public."CallType" OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 26088)
-- Name: ConnectionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ConnectionStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."ConnectionStatus" OWNER TO postgres;

--
-- TOC entry 910 (class 1247 OID 35413)
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'DECLINED'
);


ALTER TYPE public."RequestStatus" OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 26081)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'USER',
    'GUEST'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 26235)
-- Name: Call; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Call" (
    id integer NOT NULL,
    caller_id integer NOT NULL,
    receiver_id integer NOT NULL,
    type public."CallType" NOT NULL,
    duration integer,
    started_at timestamp(3) without time zone,
    ended_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."CallStatus" DEFAULT 'RINGING'::public."CallStatus" NOT NULL
);


ALTER TABLE public."Call" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 26234)
-- Name: Call_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Call_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Call_id_seq" OWNER TO postgres;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 234
-- Name: Call_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Call_id_seq" OWNED BY public."Call".id;


--
-- TOC entry 221 (class 1259 OID 26107)
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 26106)
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 220
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- TOC entry 239 (class 1259 OID 35420)
-- Name: ChatRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatRequest" (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    message text NOT NULL,
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hidden_from_receiver boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ChatRequest" OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 35419)
-- Name: ChatRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChatRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChatRequest_id_seq" OWNER TO postgres;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 238
-- Name: ChatRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChatRequest_id_seq" OWNED BY public."ChatRequest".id;


--
-- TOC entry 233 (class 1259 OID 26225)
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 26224)
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 232
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- TOC entry 225 (class 1259 OID 26127)
-- Name: Connection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Connection" (
    id integer NOT NULL,
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    status public."ConnectionStatus" DEFAULT 'PENDING'::public."ConnectionStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Connection" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 26126)
-- Name: Connection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Connection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Connection_id_seq" OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 224
-- Name: Connection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Connection_id_seq" OWNED BY public."Connection".id;


--
-- TOC entry 231 (class 1259 OID 26217)
-- Name: Like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Like" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Like" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 26216)
-- Name: Like_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Like_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Like_id_seq" OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 230
-- Name: Like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Like_id_seq" OWNED BY public."Like".id;


--
-- TOC entry 227 (class 1259 OID 26136)
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    content text NOT NULL,
    sent_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_request boolean DEFAULT false NOT NULL,
    is_delivered boolean DEFAULT true NOT NULL,
    is_failed boolean DEFAULT false NOT NULL,
    is_read boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 26135)
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 226
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- TOC entry 229 (class 1259 OID 26151)
-- Name: Otp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Otp" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    code text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_used boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Otp" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 26150)
-- Name: Otp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Otp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Otp_id_seq" OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 228
-- Name: Otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Otp_id_seq" OWNED BY public."Otp".id;


--
-- TOC entry 223 (class 1259 OID 26117)
-- Name: Post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    category_id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "authorId" integer NOT NULL
);


ALTER TABLE public."Post" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 27879)
-- Name: PostImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PostImage" (
    id integer NOT NULL,
    post_id integer NOT NULL,
    image_url text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PostImage" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 27878)
-- Name: PostImage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PostImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PostImage_id_seq" OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 236
-- Name: PostImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PostImage_id_seq" OWNED BY public."PostImage".id;


--
-- TOC entry 222 (class 1259 OID 26116)
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Post_id_seq" OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 222
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- TOC entry 219 (class 1259 OID 26096)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'GUEST'::public."Role" NOT NULL,
    about_me text,
    date_of_birth timestamp(3) without time zone,
    last_active timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profile_picture text,
    cover_photo text,
    knowledge_interests text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 26095)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 217 (class 1259 OID 26071)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4838 (class 2604 OID 26238)
-- Name: Call id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Call" ALTER COLUMN id SET DEFAULT nextval('public."Call_id_seq"'::regclass);


--
-- TOC entry 4818 (class 2604 OID 26110)
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- TOC entry 4843 (class 2604 OID 35423)
-- Name: ChatRequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRequest" ALTER COLUMN id SET DEFAULT nextval('public."ChatRequest_id_seq"'::regclass);


--
-- TOC entry 4836 (class 2604 OID 26228)
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- TOC entry 4822 (class 2604 OID 26130)
-- Name: Connection id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Connection" ALTER COLUMN id SET DEFAULT nextval('public."Connection_id_seq"'::regclass);


--
-- TOC entry 4834 (class 2604 OID 26220)
-- Name: Like id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like" ALTER COLUMN id SET DEFAULT nextval('public."Like_id_seq"'::regclass);


--
-- TOC entry 4825 (class 2604 OID 26139)
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- TOC entry 4831 (class 2604 OID 26154)
-- Name: Otp id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Otp" ALTER COLUMN id SET DEFAULT nextval('public."Otp_id_seq"'::regclass);


--
-- TOC entry 4820 (class 2604 OID 26120)
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- TOC entry 4841 (class 2604 OID 27882)
-- Name: PostImage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostImage" ALTER COLUMN id SET DEFAULT nextval('public."PostImage_id_seq"'::regclass);


--
-- TOC entry 4813 (class 2604 OID 26099)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 5067 (class 0 OID 26235)
-- Dependencies: 235
-- Data for Name: Call; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Call" VALUES (148, 119, 108, 'VIDEO', 33, '2025-07-20 15:24:16.611', '2025-07-20 15:24:49.618', '2025-07-20 15:24:13.256', 'ENDED');
INSERT INTO public."Call" VALUES (149, 119, 108, 'VIDEO', 25, '2025-07-20 15:27:05.15', '2025-07-20 15:27:30.22', '2025-07-20 15:27:02.162', 'ENDED');
INSERT INTO public."Call" VALUES (150, 119, 108, 'VIDEO', 28, '2025-07-20 15:30:52.802', '2025-07-20 15:31:21.697', '2025-07-20 15:30:48.836', 'ENDED');
INSERT INTO public."Call" VALUES (152, 119, 108, 'VIDEO', 70, '2025-07-20 15:34:36.868', '2025-07-20 15:35:47.732', '2025-07-20 15:34:34.088', 'ENDED');
INSERT INTO public."Call" VALUES (153, 119, 108, 'VOICE', 6, '2025-07-20 15:36:04.64', '2025-07-20 15:36:11.224', '2025-07-20 15:35:59.616', 'ENDED');
INSERT INTO public."Call" VALUES (154, 119, 108, 'VOICE', 24, '2025-07-20 15:36:23.515', '2025-07-20 15:36:48.325', '2025-07-20 15:36:17.965', 'ENDED');
INSERT INTO public."Call" VALUES (155, 119, 108, 'VIDEO', 19, '2025-07-20 15:41:38.585', '2025-07-20 15:41:58.534', '2025-07-20 15:41:37.445', 'ENDED');
INSERT INTO public."Call" VALUES (157, 119, 108, 'VIDEO', 85, '2025-07-20 15:46:08.925', '2025-07-20 15:47:34.546', '2025-07-20 15:46:00.115', 'ENDED');
INSERT INTO public."Call" VALUES (158, 119, 108, 'VIDEO', 72, '2025-07-20 15:50:11.557', '2025-07-20 15:51:23.683', '2025-07-20 15:50:08.238', 'ENDED');
INSERT INTO public."Call" VALUES (159, 119, 108, 'VIDEO', 26, '2025-07-20 15:54:09.31', '2025-07-20 15:54:35.771', '2025-07-20 15:54:06.154', 'ENDED');
INSERT INTO public."Call" VALUES (160, 119, 108, 'VIDEO', 15, '2025-07-20 15:56:38.48', '2025-07-20 15:56:53.771', '2025-07-20 15:56:35.277', 'ENDED');
INSERT INTO public."Call" VALUES (161, 119, 108, 'VOICE', 4, '2025-07-20 15:56:56.232', '2025-07-20 15:57:00.442', '2025-07-20 15:56:54.653', 'ENDED');
INSERT INTO public."Call" VALUES (162, 119, 108, 'VIDEO', 21, '2025-07-20 15:57:05.23', '2025-07-20 15:57:27.202', '2025-07-20 15:57:01.26', 'ENDED');
INSERT INTO public."Call" VALUES (163, 119, 108, 'VIDEO', 152, '2025-07-20 15:59:51.036', '2025-07-20 16:02:23.402', '2025-07-20 15:59:47.771', 'ENDED');
INSERT INTO public."Call" VALUES (164, 119, 108, 'VOICE', 3, '2025-07-20 16:02:26.217', '2025-07-20 16:02:29.376', '2025-07-20 16:02:24.554', 'ENDED');
INSERT INTO public."Call" VALUES (165, 119, 108, 'VIDEO', 6, '2025-07-20 16:02:33.056', '2025-07-20 16:02:39.865', '2025-07-20 16:02:30.215', 'ENDED');
INSERT INTO public."Call" VALUES (166, 119, 108, 'VIDEO', 9, '2025-07-20 16:06:41.921', '2025-07-20 16:06:51.303', '2025-07-20 16:06:38.991', 'ENDED');
INSERT INTO public."Call" VALUES (167, 119, 108, 'VOICE', 2, '2025-07-20 16:06:58.509', '2025-07-20 16:07:01.5', '2025-07-20 16:06:53.477', 'ENDED');
INSERT INTO public."Call" VALUES (168, 119, 108, 'VIDEO', 73, '2025-07-20 16:07:10.9', '2025-07-20 16:08:24.809', '2025-07-20 16:07:03.521', 'ENDED');
INSERT INTO public."Call" VALUES (169, 119, 108, 'VIDEO', 53, '2025-07-20 16:08:33.955', '2025-07-20 16:09:27.75', '2025-07-20 16:08:31.492', 'ENDED');
INSERT INTO public."Call" VALUES (147, 119, 108, 'VIDEO', 2, '2025-07-20 15:22:05.353', '2025-07-20 15:22:08.18', '2025-07-20 15:22:03.067', 'ENDED');
INSERT INTO public."Call" VALUES (170, 119, 108, 'VIDEO', 81, '2025-07-20 16:11:16.536', '2025-07-20 16:12:38.192', '2025-07-20 16:11:11.874', 'ENDED');
INSERT INTO public."Call" VALUES (171, 119, 108, 'VIDEO', 32, '2025-07-20 16:16:21.304', '2025-07-20 16:16:53.343', '2025-07-20 16:16:17.363', 'ENDED');
INSERT INTO public."Call" VALUES (173, 119, 108, 'VIDEO', 25, '2025-07-20 16:22:07.47', '2025-07-20 16:22:33.306', '2025-07-20 16:22:03.501', 'ENDED');
INSERT INTO public."Call" VALUES (175, 108, 119, 'VIDEO', 12, '2025-07-20 16:24:47.933', '2025-07-20 16:25:00.546', '2025-07-20 16:24:42.335', 'ENDED');


--
-- TOC entry 5053 (class 0 OID 26107)
-- Dependencies: 221
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Category" VALUES (1, 'Language and Communication', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (2, 'Music and Arts', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (3, 'Technology and Innovation', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (4, 'Cooking and Baking', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (5, 'Business and Management', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (6, 'Science and General Knowledge', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (7, 'Handicrafts & DIY', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (8, 'Photography and Videography', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (9, 'Writing and Editing', '2025-06-06 12:00:00');
INSERT INTO public."Category" VALUES (10, 'Design and Creativity', '2025-06-06 12:00:00');


--
-- TOC entry 5071 (class 0 OID 35420)
-- Dependencies: 239
-- Data for Name: ChatRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ChatRequest" VALUES (51, 108, 119, 'HI I''m Guy.', 'ACCEPTED', '2025-07-19 14:32:52.441', false);


--
-- TOC entry 5065 (class 0 OID 26225)
-- Dependencies: 233
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5057 (class 0 OID 26127)
-- Dependencies: 225
-- Data for Name: Connection; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Connection" VALUES (43, 108, 119, 'ACCEPTED', '2025-07-19 14:32:52.447');


--
-- TOC entry 5063 (class 0 OID 26217)
-- Dependencies: 231
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5059 (class 0 OID 26136)
-- Dependencies: 227
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Message" VALUES (54, 108, 119, 'HI I''m Guy.', '2025-07-19 14:32:52.445', true, false, false, true);
INSERT INTO public."Message" VALUES (55, 119, 108, 'Hiiii', '2025-07-19 14:33:22.843', false, true, false, true);
INSERT INTO public."Message" VALUES (56, 108, 119, 'Hi', '2025-07-19 14:35:04.68', false, true, false, true);
INSERT INTO public."Message" VALUES (57, 119, 108, 'Hi', '2025-07-19 14:59:08.579', false, true, false, true);
INSERT INTO public."Message" VALUES (58, 119, 108, 'Hi kate', '2025-07-20 13:54:25.608', false, true, false, false);
INSERT INTO public."Message" VALUES (59, 119, 108, 'Hi kate', '2025-07-20 16:09:37.926', false, true, false, false);


--
-- TOC entry 5061 (class 0 OID 26151)
-- Dependencies: 229
-- Data for Name: Otp; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Otp" VALUES (124, 117, '895180', '2025-07-09 14:46:34.946', '2025-07-09 14:36:34.959', false);
INSERT INTO public."Otp" VALUES (125, 117, '969671', '2025-07-09 14:47:17.723', '2025-07-09 14:37:17.724', false);


--
-- TOC entry 5055 (class 0 OID 26117)
-- Dependencies: 223
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Post" VALUES (10, 1, 'Phrases to avoid in English speaking practice', 'I''ve noticed that some textbook phrases sound unnatural in real conversations. Here’s what I’ve learned.', '2025-06-17 11:07:45.966', 21);
INSERT INTO public."Post" VALUES (11, 2, 'Trying abstract painting with limited colors', 'Used just red, black, and white for this piece. Surprised how expressive it turned out!', '2025-06-17 11:10:09.511', 21);
INSERT INTO public."Post" VALUES (12, 3, 'Beginner-friendly tips for building web apps', 'Just made a to-do app using HTML, CSS, and JS. Sharing my simple process and code snippets.', '2025-06-17 11:12:58.887', 21);
INSERT INTO public."Post" VALUES (13, 4, 'Recipes that make baking feel effortless', 'If you’re new to baking, try this no-mixer chocolate cake. Minimal steps, maximum flavor.', '2025-06-17 11:14:56.954', 21);
INSERT INTO public."Post" VALUES (14, 5, 'What selling online taught me about trust', 'Running a small digital shop taught me how to deal with tough customers and keep things professional.', '2025-06-17 11:15:57.046', 21);
INSERT INTO public."Post" VALUES (15, 6, 'Science facts that surprised me last week', 'Did you know octopuses have three hearts? Sharing cool facts I discovered while reading.', '2025-06-17 11:17:49.769', 21);
INSERT INTO public."Post" VALUES (16, 7, 'Things I learned from making clay earrings', 'Tried DIY earrings with air-dry clay. They turned out cute and I had fun customizing shapes.', '2025-06-17 11:24:23.94', 21);
INSERT INTO public."Post" VALUES (17, 8, 'Natural light tricks for indoor portraits', 'No fancy gear needed—just used window light and a reflector. Here''s how I set it up.', '2025-06-17 11:26:26.082', 21);
INSERT INTO public."Post" VALUES (18, 9, 'Common writing mistakes and how to fix them', 'These are some habits I had to unlearn when editing blog posts and academic writing.', '2025-06-17 11:27:50.25', 21);
INSERT INTO public."Post" VALUES (19, 10, 'Design mistakes that weaken brand identity', 'Sometimes less is more. I reviewed a few logos and noticed patterns that hurt branding.', '2025-06-17 11:28:54.855', 21);
INSERT INTO public."Post" VALUES (20, 6, 'My First Post', 'aaaaaaaaaa', '2025-07-18 14:51:52.799', 119);
INSERT INTO public."Post" VALUES (21, 6, 'Guy Post ZGDX ', 'aaaaaaaaaa', '2025-07-19 18:49:32.462', 114);
INSERT INTO public."Post" VALUES (22, 10, 'My design', 'Youuu', '2025-07-23 22:15:45.335', 134);
INSERT INTO public."Post" VALUES (23, 3, 'My Post one', 'Hooooo', '2025-07-23 22:27:54.3', 134);


--
-- TOC entry 5069 (class 0 OID 27879)
-- Dependencies: 237
-- Data for Name: PostImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PostImage" VALUES (13, 10, '/uploads/posts/1750158465957-21-Id1.jpg', '2025-06-17 11:07:45.987');
INSERT INTO public."PostImage" VALUES (14, 11, '/uploads/posts/1750158609506-21-Id2.jpg', '2025-06-17 11:10:09.576');
INSERT INTO public."PostImage" VALUES (15, 12, '/uploads/posts/1750158778883-21-Id3.png', '2025-06-17 11:12:58.89');
INSERT INTO public."PostImage" VALUES (16, 13, '/uploads/posts/1750158896951-21-Id4.jpg', '2025-06-17 11:14:56.967');
INSERT INTO public."PostImage" VALUES (17, 14, '/uploads/posts/1750158957043-21-Id5.jpg', '2025-06-17 11:15:57.131');
INSERT INTO public."PostImage" VALUES (18, 15, '/uploads/posts/1750159069765-21-Id6.jpg', '2025-06-17 11:17:49.781');
INSERT INTO public."PostImage" VALUES (19, 16, '/uploads/posts/1750159463930-21-Id7-2.jpg', '2025-06-17 11:24:24.022');
INSERT INTO public."PostImage" VALUES (20, 16, '/uploads/posts/1750159463931-21-Id7-5.jpg', '2025-06-17 11:24:24.022');
INSERT INTO public."PostImage" VALUES (21, 16, '/uploads/posts/1750159463938-21-Id7-1.jpg', '2025-06-17 11:24:24.022');
INSERT INTO public."PostImage" VALUES (22, 17, '/uploads/posts/1750159586077-21-Id8-2.jpg', '2025-06-17 11:26:26.094');
INSERT INTO public."PostImage" VALUES (23, 17, '/uploads/posts/1750159586079-21-Id8-1.jpg', '2025-06-17 11:26:26.094');
INSERT INTO public."PostImage" VALUES (24, 18, '/uploads/posts/1750159670247-21-Id9.jpg', '2025-06-17 11:27:50.252');
INSERT INTO public."PostImage" VALUES (25, 19, '/uploads/posts/1750159734852-21-Id10.jpg', '2025-06-17 11:28:54.866');
INSERT INTO public."PostImage" VALUES (26, 20, '/uploads/posts/1752850312790-119-Sign in.png', '2025-07-18 14:51:52.887');
INSERT INTO public."PostImage" VALUES (27, 20, '/uploads/posts/1752850312795-119-picture.jpg', '2025-07-18 14:51:52.887');
INSERT INTO public."PostImage" VALUES (28, 21, '/uploads/posts/1752950972454-114-Sign in.png', '2025-07-19 18:49:32.475');
INSERT INTO public."PostImage" VALUES (29, 21, '/uploads/posts/1752950972459-114-picture.jpg', '2025-07-19 18:49:32.475');
INSERT INTO public."PostImage" VALUES (30, 22, '/uploads/posts/1753308945332-134-Shopee-Blog-Cover-Recommend-Portable-Photo-Printer-2022-1024x719.jpg', '2025-07-23 22:15:45.34');
INSERT INTO public."PostImage" VALUES (31, 23, '/uploads/posts/1753309674295-134-ai-generated-8861672_1280.png', '2025-07-23 22:27:54.314');


--
-- TOC entry 5051 (class 0 OID 26096)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES (134, 'ArayaTS', 'araya25466@gmail.com', '$2b$10$gBcA8d.2PyYqcckrCHCrdOOBHcG1IoZTsavNgxznXLEfG6WStJb9W', 'USER', 'I love me', '2025-07-29 00:00:00', '2025-07-23 16:39:40.162', '2025-07-23 16:39:40.162', '/uploads/profiles/1753288817782-ai-generated-8861672_1280.png', NULL, '{"Language and Communication","Technology and Innovation"}');
INSERT INTO public."User" VALUES (114, '1233', 'aofza1509@gmail.com', '$2b$10$ts7hFzTqIXYfBgKcuDHQFuSMzma1X0r.DyMrOViCYnmOttSyDYz8G', 'USER', '123', '2025-07-07 00:00:00', '2025-07-06 15:38:43.4', '2025-07-06 15:38:43.4', '/uploads/profiles/1751816349305-Personal.png', NULL, '{}');
INSERT INTO public."User" VALUES (117, 'user_1752071794946', 'araya25466@gmil.com', '$2b$10$/QbmiewLoM1jka0KReWXneoleci0RSblxUVuZbHAekfR90J4YPpEa', 'GUEST', NULL, NULL, '2025-07-09 14:36:34.947', '2025-07-09 14:36:34.947', NULL, NULL, '{}');
INSERT INTO public."User" VALUES (108, 'user_1751382319461', 'aofza1508@gmail.com', '$2b$10$K7avOHl8i9SvwPJ03KQFO.nKpSXVl3iGE1WacL5nMyAyPzYP/ByAG', 'USER', NULL, NULL, '2025-07-01 15:05:19.462', '2025-07-01 15:05:19.462', NULL, NULL, '{}');
INSERT INTO public."User" VALUES (119, 'KateJeeranan', 'jeeranan.prak@bumail.net', '$2b$10$M3nYBNQlS3kG4V8rKkbhveV4lmlWr4E74C75pE8kNqGHuMrieRb3W', 'USER', 'Luv Cat', '2003-10-07 00:00:00', '2025-07-10 04:38:01.896', '2025-07-10 04:38:01.896', '/uploads/profiles/1752122487937-picture.jpeg', NULL, '{"Music and Arts","Technology and Innovation","Business and Management","Design and Creativity","Language and Communication"}');
INSERT INTO public."User" VALUES (21, 'newUser', 'thanakrit.petn@gmail.com', '$2b$10$reJ.jxPHwEvtEHqoLvQBo.dxAVuM5r48V0Xoswop7MGwffDxEhsNe', 'USER', 'I love codingasdasd', '1990-01-01 00:00:00', '2025-06-11 08:19:16.43', '2025-06-11 08:19:16.43', '/uploads/profiles/1750908721199-picture.jpg', NULL, '{AI,Blockchain,Security}');


--
-- TOC entry 5049 (class 0 OID 26071)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations VALUES ('6bd70871-a3f1-4b5a-9c92-6df59513eeda', '03bab8d900d91f1886f1c8801fb7b43e0b8274734be2d88921bf0702ecb2f9ff', '2025-06-06 11:16:33.586782+07', '20250606024451_init', NULL, NULL, '2025-06-06 11:16:33.546943+07', 1);
INSERT INTO public._prisma_migrations VALUES ('6cc944e2-b54b-4089-9ac4-261b34eb7deb', 'e055ab62e3a8da06efad692144a8cc6b966b0ca0b98b60741a138be57ac84520', '2025-07-19 21:03:28.641043+07', '20250719140328_add_message_status', NULL, NULL, '2025-07-19 21:03:28.633217+07', 1);
INSERT INTO public._prisma_migrations VALUES ('4c870b1a-8224-4b6e-b1d7-ec9d4ef3bd9d', '62005421c68bd4c5327829ecf76c29446ed8672fb4d0107a037c3dc6c172c356', '2025-06-06 11:16:33.607951+07', '20250606040956_update', NULL, NULL, '2025-06-06 11:16:33.587699+07', 1);
INSERT INTO public._prisma_migrations VALUES ('d985203f-e14c-4b3d-98d4-8ac3450c9fff', '122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec', '2025-06-06 15:03:45.698007+07', '20250606041707_new', NULL, NULL, '2025-06-06 15:03:45.694988+07', 1);
INSERT INTO public._prisma_migrations VALUES ('7233341c-2299-47e2-817e-363ec30fd0fc', '633104c672e9664b8b30b835d7f500ed1708ad9c932a221c40ca98ee67e5dd99', '2025-06-06 15:03:46.25895+07', '20250606080345_add_post_images', NULL, NULL, '2025-06-06 15:03:46.25045+07', 1);
INSERT INTO public._prisma_migrations VALUES ('ce78a2fc-b0df-4c47-a05d-4c848819ebba', '201408736adb48561286daccf7294243ad4917bb8301ecfc8958fae2ac86149b', '2025-07-19 22:49:09.613915+07', '20250719154909_restore_message_status', NULL, NULL, '2025-07-19 22:49:09.60386+07', 1);
INSERT INTO public._prisma_migrations VALUES ('3be26f51-4322-41fa-92ba-b86547c9e1f0', '8306ca51767957d87f6f4cd4b105adeccd8408d78e35dd6486a27106229e0c1a', '2025-06-09 09:45:39.377465+07', '20250609024539_init', NULL, NULL, '2025-06-09 09:45:39.373139+07', 1);
INSERT INTO public._prisma_migrations VALUES ('0156e6e3-411b-4d8e-a85b-7d9adf0a16c3', 'aa5950d2694ae2bdbd9c869c4d2b780107abbbfa913e8b06634c21c614ad0ca4', '2025-06-09 15:52:46.55631+07', '20250609085246_update_post_images', NULL, NULL, '2025-06-09 15:52:46.548967+07', 1);
INSERT INTO public._prisma_migrations VALUES ('e1bd973c-f12d-44a2-a4e0-3dc9277ceab3', '5213a0deba55799b09bdc802397a4181566d35f5098007bc5548ef7a4a1c6287', '2025-06-10 13:46:25.331918+07', '20250610064625_init_profile', NULL, NULL, '2025-06-10 13:46:25.317267+07', 1);
INSERT INTO public._prisma_migrations VALUES ('449e2df0-11bc-4974-a1bc-7b213026a212', 'c78656c5084250a9887afa18cdcbc018cee75f0f68aaa0e324f94001456d71b4', '2025-07-19 23:39:59.262938+07', '20250719163958_call_status_update', NULL, NULL, '2025-07-19 23:39:59.260056+07', 1);
INSERT INTO public._prisma_migrations VALUES ('a41e5dbc-3703-41a0-bc29-6ea123d1c24e', '3bd4f89f795553322f2d7ba0e3451a57555a9f40d3257a9d12118fd28cb14a0a', '2025-06-10 13:53:24.055807+07', '20250610065323_fix_knowledge_interests', NULL, NULL, '2025-06-10 13:53:24.053255+07', 1);
INSERT INTO public._prisma_migrations VALUES ('faaf72d4-5a2e-4a83-b2b1-0f816f908100', '6f9267f0433dcea12cce80ebc0d5b6e2c7cd50b61fc00593249d748057909f2f', '2025-06-10 16:02:59.712394+07', '20250610090259_update_schema_for_chat_and_knowledge', NULL, NULL, '2025-06-10 16:02:59.696511+07', 1);
INSERT INTO public._prisma_migrations VALUES ('e085bc84-7460-4f69-b60a-10b85755a4c5', '74d873e1dba62d4716258a203fdd0a08e5774be53508a7cf8bf789c099390f31', '2025-07-09 13:50:36.576125+07', '20250709065036_allow_multiple_chat_requests', NULL, NULL, '2025-07-09 13:50:36.571545+07', 1);
INSERT INTO public._prisma_migrations VALUES ('9bd279d1-1871-43ab-b113-a26d642d60f0', '548c259366f7a53426196164cfb683434f89adb0e45b5779a3b499eafb3d56c6', '2025-07-09 15:29:12.133601+07', '20250709082911_add_hidden_flag', NULL, NULL, '2025-07-09 15:29:12.128605+07', 1);
INSERT INTO public._prisma_migrations VALUES ('b328e5a1-96ff-4731-9157-2a0865d56c67', 'e055ab62e3a8da06efad692144a8cc6b966b0ca0b98b60741a138be57ac84520', '2025-07-17 23:33:09.497562+07', '20250717163309_add_message_status_fields', NULL, NULL, '2025-07-17 23:33:09.488574+07', 1);
INSERT INTO public._prisma_migrations VALUES ('2b0a410f-1fb2-4916-9645-00d052fd526f', '196da76879b06bc47a9ea661cefcc76a34f9baefeb6110fd5f7c6c202ca3126d', '2025-07-17 23:39:45.42415+07', '20250717163944_add_message_status_fields', NULL, NULL, '2025-07-17 23:39:45.41511+07', 1);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 234
-- Name: Call_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Call_id_seq"', 175, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 220
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 1, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 238
-- Name: ChatRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatRequest_id_seq"', 51, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 232
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 1, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 224
-- Name: Connection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Connection_id_seq"', 44, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 230
-- Name: Like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Like_id_seq"', 1, true);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 226
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 59, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 228
-- Name: Otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Otp_id_seq"', 142, true);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 236
-- Name: PostImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PostImage_id_seq"', 31, true);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 222
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Post_id_seq"', 23, true);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 134, true);


--
-- TOC entry 4880 (class 2606 OID 26240)
-- Name: Call Call_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Call"
    ADD CONSTRAINT "Call_pkey" PRIMARY KEY (id);


--
-- TOC entry 4857 (class 2606 OID 26115)
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 35429)
-- Name: ChatRequest ChatRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRequest"
    ADD CONSTRAINT "ChatRequest_pkey" PRIMARY KEY (id);


--
-- TOC entry 4876 (class 2606 OID 26233)
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 26134)
-- Name: Connection Connection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Connection"
    ADD CONSTRAINT "Connection_pkey" PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 26223)
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 26144)
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 26159)
-- Name: Otp Otp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Otp"
    ADD CONSTRAINT "Otp_pkey" PRIMARY KEY (id);


--
-- TOC entry 4882 (class 2606 OID 27887)
-- Name: PostImage PostImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostImage"
    ADD CONSTRAINT "PostImage_pkey" PRIMARY KEY (id);


--
-- TOC entry 4860 (class 2606 OID 26125)
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- TOC entry 4851 (class 2606 OID 26105)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4848 (class 2606 OID 26079)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 1259 OID 32658)
-- Name: Call_caller_id_receiver_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Call_caller_id_receiver_id_idx" ON public."Call" USING btree (caller_id, receiver_id);


--
-- TOC entry 4854 (class 1259 OID 32659)
-- Name: Category_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Category_name_idx" ON public."Category" USING btree (name);


--
-- TOC entry 4855 (class 1259 OID 26162)
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- TOC entry 4887 (class 1259 OID 35430)
-- Name: ChatRequest_receiver_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatRequest_receiver_id_status_idx" ON public."ChatRequest" USING btree (receiver_id, status);


--
-- TOC entry 4877 (class 1259 OID 32660)
-- Name: Comment_user_id_post_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Comment_user_id_post_id_idx" ON public."Comment" USING btree (user_id, post_id);


--
-- TOC entry 4863 (class 1259 OID 32661)
-- Name: Connection_user1_id_user2_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Connection_user1_id_user2_id_idx" ON public."Connection" USING btree (user1_id, user2_id);


--
-- TOC entry 4864 (class 1259 OID 26163)
-- Name: Connection_user1_id_user2_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Connection_user1_id_user2_id_key" ON public."Connection" USING btree (user1_id, user2_id);


--
-- TOC entry 4873 (class 1259 OID 32662)
-- Name: Like_user_id_post_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Like_user_id_post_id_idx" ON public."Like" USING btree (user_id, post_id);


--
-- TOC entry 4874 (class 1259 OID 26241)
-- Name: Like_user_id_post_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Like_user_id_post_id_key" ON public."Like" USING btree (user_id, post_id);


--
-- TOC entry 4867 (class 1259 OID 32663)
-- Name: Message_sender_id_receiver_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_sender_id_receiver_id_idx" ON public."Message" USING btree (sender_id, receiver_id);


--
-- TOC entry 4870 (class 1259 OID 32664)
-- Name: Otp_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Otp_user_id_idx" ON public."Otp" USING btree (user_id);


--
-- TOC entry 4883 (class 1259 OID 30912)
-- Name: PostImage_post_id_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PostImage_post_id_id_key" ON public."PostImage" USING btree (post_id, id);


--
-- TOC entry 4884 (class 1259 OID 30911)
-- Name: PostImage_post_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PostImage_post_id_idx" ON public."PostImage" USING btree (post_id);


--
-- TOC entry 4858 (class 1259 OID 30910)
-- Name: Post_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Post_authorId_idx" ON public."Post" USING btree ("authorId");


--
-- TOC entry 4849 (class 1259 OID 26161)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4852 (class 1259 OID 32665)
-- Name: User_username_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_username_idx" ON public."User" USING btree (username);


--
-- TOC entry 4853 (class 1259 OID 26160)
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- TOC entry 4899 (class 2606 OID 26268)
-- Name: Call Call_caller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Call"
    ADD CONSTRAINT "Call_caller_id_fkey" FOREIGN KEY (caller_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4900 (class 2606 OID 26273)
-- Name: Call Call_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Call"
    ADD CONSTRAINT "Call_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 35437)
-- Name: ChatRequest ChatRequest_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRequest"
    ADD CONSTRAINT "ChatRequest_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4903 (class 2606 OID 35432)
-- Name: ChatRequest ChatRequest_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRequest"
    ADD CONSTRAINT "ChatRequest_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4897 (class 2606 OID 26263)
-- Name: Comment Comment_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4898 (class 2606 OID 26258)
-- Name: Comment Comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4890 (class 2606 OID 26174)
-- Name: Connection Connection_user1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Connection"
    ADD CONSTRAINT "Connection_user1_id_fkey" FOREIGN KEY (user1_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4891 (class 2606 OID 26179)
-- Name: Connection Connection_user2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Connection"
    ADD CONSTRAINT "Connection_user2_id_fkey" FOREIGN KEY (user2_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4895 (class 2606 OID 26253)
-- Name: Like Like_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4896 (class 2606 OID 26248)
-- Name: Like Like_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4892 (class 2606 OID 26189)
-- Name: Message Message_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4893 (class 2606 OID 26184)
-- Name: Message Message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4894 (class 2606 OID 26204)
-- Name: Otp Otp_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Otp"
    ADD CONSTRAINT "Otp_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4901 (class 2606 OID 27888)
-- Name: PostImage PostImage_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostImage"
    ADD CONSTRAINT "PostImage_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4888 (class 2606 OID 26243)
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4889 (class 2606 OID 26169)
-- Name: Post Post_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-07-27 12:10:52

--
-- PostgreSQL database dump complete
--

