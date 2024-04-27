--------------------------------------------------------
--  DDL for Table WORKEDON
--------------------------------------------------------

  CREATE TABLE "LBELNAVISWALTERS"."WORKEDON" 
   (	"TCONST" VARCHAR2(255 BYTE), 
	"NCONST" VARCHAR2(255 BYTE), 
	"ROLE" VARCHAR2(255 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
  GRANT ALTER ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT ALTER ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT ALTER ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT INDEX ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT INDEX ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT INDEX ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT INSERT ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT INSERT ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT INSERT ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT SELECT ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT SELECT ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT SELECT ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT UPDATE ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT UPDATE ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT UPDATE ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT REFERENCES ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT REFERENCES ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT REFERENCES ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT READ ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT READ ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT READ ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT ON COMMIT REFRESH ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT ON COMMIT REFRESH ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT ON COMMIT REFRESH ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT QUERY REWRITE ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT QUERY REWRITE ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT QUERY REWRITE ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT DEBUG ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT DEBUG ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT DEBUG ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
  GRANT FLASHBACK ON "LBELNAVISWALTERS"."WORKEDON" TO "VOIGTC";
  GRANT FLASHBACK ON "LBELNAVISWALTERS"."WORKEDON" TO "KAUSHAL.AADITYA";
  GRANT FLASHBACK ON "LBELNAVISWALTERS"."WORKEDON" TO "JACKLEA";
