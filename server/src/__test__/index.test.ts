import { server } from "../index";
import supertest from "supertest";

import request from "superagent";
import { before } from "node:test";
const user1 = supertest.agent(server);

const requestWithSupertest = supertest(server);

let cookie: string;
describe("User Endpoints", () => {
  beforeAll(async () => {
    // WE DELETE THE FAKE USER IF IT EXISTS
    const res = user1
      .post("/api/users/signin")
      .send({ email: "admin@admin.com", password: "password" });
    if ((await res).body.id) {
      user1
        .delete("/api/users/profile")
        .set("cookie", (await res).headers["set-cookie"][0]);
    }
  });
  describe("Testing Registration", () => {
    it("POST on /api/users/ to register a user should fail when email or password is missing", async () => {
      const res = user1.post("/api/users/");
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe(
        "User email or password is missing"
      );
    });
    it("POST on /api/users/ to register a user should fail when password is missing", async () => {
      const res = user1.post("/api/users/").send({ email: "admin@admin.com" });
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe(
        "User email or password is missing"
      );
    });
    it("POST on /api/users/ to register a user should fail when email is missing", async () => {
      const res = user1.post("/api/users/").send({ password: "password" });
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe(
        "User email or password is missing"
      );
    });
    it("POST on /api/users/ to register a user should succeed when an email and password are provided and the user does not already exist", async () => {
      const res = user1
        .post("/api/users/")
        .send({ email: "admin@admin.com", password: "password" });
      expect((await res).status).toBe(201);
      expect((await res).body.email).toBe("admin@admin.com");
    });
    it("POST on /api/users/ to register a user should fail when a user already exists", async () => {
      const res = user1
        .post("/api/users/")
        .send({ email: "admin@admin.com", password: "password" });
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe("User already exists");
    });
  });
  describe("Testing Authentification", () => {
    it("POST on /api/users/signin to auth a user should fail when email or password is missing", async () => {
      const res = user1.post("/api/users/signin");
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe(
        "User email or password is missing"
      );
    });

    it("POST on /api/users/signin to signin a user should fail when password is missing", async () => {
      const res = user1
        .post("/api/users/signin")
        .send({ email: "admin@admin.com" });
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe(
        "User email or password is missing"
      );
    });
    it("POST on /api/users/signin to signin a user should fail when email is missing", async () => {
      const res = user1
        .post("/api/users/signin")
        .send({ password: "password" });
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe(
        "User email or password is missing"
      );
    });
    it("POST on /api/users/signin to signin a user should fail when an email is not in the db", async () => {
      const res = user1
        .post("/api/users/signin")
        .send({ email: "foo@bar.com", password: "password" });
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe("Invalid email or password");
    });
    it("POST on /api/users/signin to auth a user should fail when a passwird is incorrect", async () => {
      const res = user1
        .post("/api/users/signin")
        .send({ email: "admin@admin.com", password: "wrongpassword" });
      expect((await res).status).toBe(500);
      expect((await res).body.message).toBe("Invalid email or password");
    });
    it("POST on /api/users/signin to auth a user should succeed when a correct email and password is provided", async () => {
      const res = user1
        .post("/api/users/signin")
        .send({ email: "admin@admin.com", password: "password" });
      expect((await res).status).toBe(201);
      expect((await res).body.id).toBeTruthy();
      expect((await res).body.email).toContain("admin@admin.com");
      cookie = (await res).headers["set-cookie"][0];
    });
  });
  describe("Testing GET Profile", () => {
    it("GET on /api/users/profile should fail if the cookie is missing", async () => {
      const res = user1.get("/api/users/profile");
      // .set("cookie", cookie)
      expect((await res).status).toBe(401);
      expect((await res).body.message).toBe("Not authorized, no token");
    });
    it("GET on /api/users/profile should fail if the cookie is wrong", async () => {
      const res = user1.get("/api/users/profile").set("cookie", "jwt=foobar");
      expect((await res).status).toBe(401);
      expect((await res).body.message).toBe("Not authorized, wrong token");
    });
    it("GET on /api/users/profile should return a user profile ", async () => {
      const res = user1.get("/api/users/profile").set("cookie", cookie);
      expect((await res).status).toBe(200);
      expect((await res).body.id).toBeTruthy();
      expect((await res).body.email).toContain("admin@admin.com");
    });
  });
  describe("Testing UPDATE Profile", () => {
    it("UPDATE on /api/users/profile should fail if the cookie is missing", async () => {
      const res = user1.put("/api/users/profile");
      // .set("cookie", cookie)
      expect((await res).status).toBe(401);
      expect((await res).body.message).toBe("Not authorized, no token");
    });
    it("UPDATE on /api/users/profile should fail if the cookie is wrong", async () => {
      const res = user1.put("/api/users/profile").set("cookie", "jwt=foobar");
      expect((await res).status).toBe(401);
      expect((await res).body.message).toBe("Not authorized, wrong token");
    });
    it("UPDATE on /api/users/profile should return a user profile ", async () => {
      const userProfile = user1.get("/api/users/profile").set("cookie", cookie);

      expect((await userProfile).status).toBe(200);
      expect((await userProfile).body.id).toBeTruthy();
      expect((await userProfile).body.email).toContain("admin@admin.com");
      expect((await userProfile).body.name).toBeNull();

      const updatedUserProfile = user1
        .put("/api/users/profile")
        .set("cookie", cookie)
        .send({ id: 10, name: "foobar" });

      expect((await updatedUserProfile).status).toBe(200);
      expect((await updatedUserProfile).body.id).toBeTruthy();
      expect((await updatedUserProfile).body.email).toContain(
        "admin@admin.com"
      );
      expect((await updatedUserProfile).body.name).toBe("foobar");
    });
  });
  describe("Testing DELETE on /api/users/profile", async () => {
    it("DELETE on /api/users/profile should fail if the cookie is wrong", async () => {
      const res = user1.delete("/api/users/profile");
      expect((await res).status).toBe(401);
    });
    it("DELETE on /api/users/profile should succeed if the cookie is correct and the user exists", async () => {
      const res = user1.delete("/api/users/profile").set("cookie", cookie);
      expect((await res).status).toBe(200);
    });
  });
});
