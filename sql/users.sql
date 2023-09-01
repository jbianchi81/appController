--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.24
-- Dumped by pg_dump version 12.6 (Ubuntu 12.6-0ubuntu0.20.04.1)

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

--
-- Name: user_roles; Type: TABLE; Schema: public; 
--

CREATE TABLE public.user_roles (
    name character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; 
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    pass_enc bytea,
    role character varying,
    password character varying,
    token bytea
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; 
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; 
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; 
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; 
--

COPY public.user_roles (name) FROM stdin;
reader
writer
admin
public
\.



--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (name);


--
-- Name: users users_id_key; Type: CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_key UNIQUE (id);


--
-- Name: users users_name_key; Type: CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_key UNIQUE (name);


--
-- Name: users users_role_fkey; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.user_roles(name);




--
-- PostgreSQL database dump complete
--

