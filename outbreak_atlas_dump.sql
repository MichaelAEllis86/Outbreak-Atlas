--
-- PostgreSQL database dump
--

\restrict JDhUblkWQOnVgCYhFthp1Y5l3aQ6vfGqfUaveRl8hJ2k8Yg2vbbUJBxd10hizBB

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: mooks2022
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    primary_symptom text NOT NULL,
    symptoms text[] NOT NULL,
    severity character varying(10) NOT NULL,
    temperature numeric(4,1) DEFAULT 98.6 NOT NULL,
    notes text,
    zipcode character varying(5) NOT NULL,
    state character(2) NOT NULL,
    latitude numeric(9,6),
    longitude numeric(9,6),
    has_location boolean GENERATED ALWAYS AS (((latitude IS NOT NULL) AND (longitude IS NOT NULL))) STORED,
    CONSTRAINT reports_severity_check CHECK (((severity)::text = ANY ((ARRAY['mild'::character varying, 'moderate'::character varying, 'severe'::character varying])::text[]))),
    CONSTRAINT reports_state_check CHECK ((state ~ '^[A-Z]{2}$'::text)),
    CONSTRAINT reports_temperature_check CHECK (((temperature >= (90)::numeric) AND (temperature <= (110)::numeric))),
    CONSTRAINT reports_zipcode_check CHECK (((zipcode)::text ~ '^\d{5}$'::text))
);


ALTER TABLE public.reports OWNER TO mooks2022;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: mooks2022
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reports_id_seq OWNER TO mooks2022;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mooks2022
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: user_locations; Type: TABLE; Schema: public; Owner: mooks2022
--

CREATE TABLE public.user_locations (
    id integer NOT NULL,
    user_id integer,
    nickname text,
    zipcode character varying(5) NOT NULL,
    state character(2) NOT NULL,
    CONSTRAINT user_locations_state_check CHECK ((state ~ '^[A-Z]{2}$'::text)),
    CONSTRAINT user_locations_zipcode_check CHECK (((zipcode)::text ~ '^[0-9]{5}$'::text))
);


ALTER TABLE public.user_locations OWNER TO mooks2022;

--
-- Name: user_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: mooks2022
--

CREATE SEQUENCE public.user_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_locations_id_seq OWNER TO mooks2022;

--
-- Name: user_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mooks2022
--

ALTER SEQUENCE public.user_locations_id_seq OWNED BY public.user_locations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: mooks2022
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(15) NOT NULL,
    password text NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    age integer NOT NULL,
    zipcode character varying(5) NOT NULL,
    state character(2) NOT NULL,
    country character varying(3) DEFAULT 'USA'::character varying NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_state_check CHECK ((state ~ '^[A-Z]{2}$'::text)),
    CONSTRAINT users_zipcode_check CHECK (((zipcode)::text ~ '^\d{5}$'::text))
);


ALTER TABLE public.users OWNER TO mooks2022;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mooks2022
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO mooks2022;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mooks2022
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: user_locations id; Type: DEFAULT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.user_locations ALTER COLUMN id SET DEFAULT nextval('public.user_locations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: mooks2022
--

COPY public.reports (id, user_id, created_at, primary_symptom, symptoms, severity, temperature, notes, zipcode, state, latitude, longitude) FROM stdin;
1	1	2025-09-18 19:49:23.013846	fever	{fever,fatigue}	moderate	100.9	Fever with fatigue	10001	NY	40.712800	-74.006000
2	2	2025-09-17 19:49:23.013846	cough	{cough,"sore throat"}	mild	99.0	Slight cough	30301	GA	\N	\N
3	3	2025-09-16 19:49:23.013846	shortness of breath	{"shortness of breath","chest pain"}	severe	102.0	ER visit	60601	IL	41.878100	-87.629800
4	4	2025-09-15 19:49:23.013846	fatigue	{fatigue}	mild	98.2	Exhausted after work	94101	CA	\N	\N
5	5	2025-09-04 19:49:23.013846	rash	{rash,itchiness}	moderate	99.4	Skin reaction	75201	TX	\N	\N
6	6	2025-08-30 19:49:23.013846	diarrhea	{diarrhea,nausea}	moderate	100.1	Stomach flu	98101	WA	47.606200	-122.332100
7	7	2025-09-01 19:49:23.013846	headache	{headache}	mild	98.6	Recurring migraine	85001	AZ	\N	\N
8	8	2025-09-07 19:49:23.013846	fever	{fever,cough}	severe	103.4	Hospitalized	33101	FL	25.761700	-80.191800
9	9	2025-07-19 19:49:23.013846	nausea	{nausea,vomiting}	severe	101.2	Food poisoning	15201	PA	40.440600	-79.995900
10	10	2025-06-19 19:49:23.013846	cough	{cough,congestion}	moderate	99.9	Dry cough	19101	PA	\N	\N
11	11	2025-05-19 19:49:23.013846	bodyache	{bodyache,chills}	moderate	100.7	Muscle soreness	80201	CO	39.739200	-104.990300
12	12	2025-04-19 19:49:23.013846	fever	{fever,chills}	severe	104.1	Severe flu	73301	TX	30.267200	-97.743100
13	13	2025-02-19 19:49:23.013846	rash	{rash}	mild	98.4	Mild rash	48201	MI	42.331400	-83.045800
14	14	2025-01-19 19:49:23.013846	diarrhea	{diarrhea,cramps}	moderate	99.8	Traveler’s diarrhea	97201	OR	\N	\N
15	15	2024-12-19 19:49:23.013846	fatigue	{fatigue,headache}	moderate	99.3	Post-viral fatigue	10001	NY	\N	\N
16	1	2024-10-19 19:49:23.013846	chills	{chills}	severe	102.6	Shaking chills	60601	IL	\N	\N
17	2	2024-11-19 19:49:23.013846	sore throat	{"sore throat"}	mild	98.7	Mild throat pain	94101	CA	\N	\N
18	3	2024-09-19 19:49:23.013846	cough	{cough,fatigue}	moderate	100.2	Persistent cough	98101	WA	47.609700	-122.333100
28	16	2025-09-26 19:21:31.17717	nausea	{nausea,vomiting,diarrhea,fever}	severe	102.1		23906	SC	34.944227	-81.932360
29	16	2025-09-29 20:18:25.242026	nausea	{nausea,vomiting,diarrhea}	severe	102.3		23906	SC	34.944302	-81.932436
30	16	2025-09-29 20:53:23.982442	sneezing	{cough,congestion,sneezing,headache}	mild	98.6		23906	SC	34.944228	-81.932358
31	16	2025-09-29 20:54:07.816068	nausea	{cough,congestion,sneezing,nausea,vomiting}	moderate	100.2	oof	23906	SC	34.944302	-81.932436
32	16	2025-09-29 21:33:01.286531	rash	{rash}	mild	98.6		29307	SC	\N	\N
33	16	2025-09-29 21:34:15.450037	nausea	{vomiting,nausea}	moderate	100.6		29307	SC	\N	\N
34	16	2025-09-30 12:11:35.707759	sneezing	{cough}	mild	98.6	test123	29307	SC	\N	\N
35	16	2025-10-02 15:01:57.445289	congestion	{congestion,sneezing}	mild	98.6		29306	SC	34.944302	-81.932437
36	16	2025-10-06 21:50:20.366803	congestion	{cough,congestion,sneezing}	mild	98.6		29307	SC	34.945040	-81.932692
27	16	2025-09-23 12:07:20.073919	cough	{cough,congestion,sneezing,nausea}	mild	100.4	test edit	23906	SC	34.944226	-81.932358
37	16	2025-10-07 12:25:40.762927	sneezing	{cough,congestion,sneezing,nausea}	moderate	100.0	new test illness	23906	SC	\N	\N
38	16	2025-10-14 20:32:23.626813	cough	{cough,congestion,sneezing}	mild	98.6	sore throat	23906	SC	34.944711	-81.932524
\.


--
-- Data for Name: user_locations; Type: TABLE DATA; Schema: public; Owner: mooks2022
--

COPY public.user_locations (id, user_id, nickname, zipcode, state) FROM stdin;
1	1	Home (NYC)	10001	NY
2	2	Work (Atlanta)	30301	GA
3	2	Vacation Spot	75201	TX
4	3	Home (Chicago)	60601	IL
5	4	Bay Area	94101	CA
6	5	Dallas	75201	TX
7	6	Seattle Center	98101	WA
8	7	Phoenix Base	85001	AZ
9	8	Miami Beach	33101	FL
10	9	Pittsburgh	15201	PA
11	10	Philly Home	19101	PA
12	11	Denver Apt	80201	CO
13	12	Austin	73301	TX
14	13	Detroit	48201	MI
15	14	Portland	97201	OR
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mooks2022
--

COPY public.users (id, username, password, first_name, last_name, age, zipcode, state, country, is_admin, created_at) FROM stdin;
1	admin	hashedpassword1	Alice	Admin	35	10001	NY	USA	t	2025-09-19 19:49:23.009483
2	mooks2022	mookster21	Michael	Ellis	38	10001	NY	USA	t	2025-09-19 19:49:23.009483
3	john_doe	hashedpassword2	John	Doe	28	30301	GA	USA	f	2025-09-19 19:49:23.009483
4	jane_smith	hashedpassword3	Jane	Smith	42	60601	IL	USA	f	2025-09-19 19:49:23.009483
5	mark_twain	hashedpassword4	Mark	Twain	50	94101	CA	USA	f	2025-09-19 19:49:23.009483
6	lucy_liu	hashedpassword5	Lucy	Liu	33	75201	TX	USA	f	2025-09-19 19:49:23.009483
7	emma_white	hashedpassword6	Emma	White	29	98101	WA	USA	f	2025-09-19 19:49:23.009483
8	oliver_gray	hashedpassword7	Oliver	Gray	45	85001	AZ	USA	f	2025-09-19 19:49:23.009483
9	mia_green	hashedpassword8	Mia	Green	36	33101	FL	USA	f	2025-09-19 19:49:23.009483
10	liam_brown	hashedpassword9	Liam	Brown	40	15201	PA	USA	f	2025-09-19 19:49:23.009483
11	sofia_clark	hashedpassword10	Sofia	Clark	27	80201	CO	USA	f	2025-09-19 19:49:23.009483
12	ethan_martin	hashedpassword11	Ethan	Martin	31	19101	PA	USA	f	2025-09-19 19:49:23.009483
13	ava_jones	hashedpassword12	Ava	Jones	22	73301	TX	USA	f	2025-09-19 19:49:23.009483
14	noah_wilson	hashedpassword13	Noah	Wilson	55	48201	MI	USA	f	2025-09-19 19:49:23.009483
15	isabella_lopez	hashedpassword14	Isabella	Lopez	34	97201	OR	USA	f	2025-09-19 19:49:23.009483
16	ProfFarnsworth	$2b$12$qsvMBpnIgTjMQM03iOi9nObeCKXevUXztSLPmq.2QpNw4FdsncQaa	Michael	Ellis	38	23906	SC	USA	f	2025-09-22 16:17:16.825671
\.


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mooks2022
--

SELECT pg_catalog.setval('public.reports_id_seq', 39, true);


--
-- Name: user_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mooks2022
--

SELECT pg_catalog.setval('public.user_locations_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mooks2022
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: user_locations user_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.user_locations
    ADD CONSTRAINT user_locations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_locations user_locations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mooks2022
--

ALTER TABLE ONLY public.user_locations
    ADD CONSTRAINT user_locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict JDhUblkWQOnVgCYhFthp1Y5l3aQ6vfGqfUaveRl8hJ2k8Yg2vbbUJBxd10hizBB

