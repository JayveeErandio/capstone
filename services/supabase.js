import { supabase } from "../lib/supabase";

export async function putPost(data) {
  await supabase.from("pending_posts").insert([data]);
}

export async function login(studentID, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${studentID}@moodlink.com`,
    password: password,
  });

  if (data.session) {
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("student_number", studentID)
      .single();

    const value = { ...student, success: true };
    const temp = async () => {
      await AsyncStorage.setItem("user", JSON.stringify(value));
    };
    temp();
    return value;
  }

  return { success: false };
}

export async function logout() {
  await supabase.auth.signOut();
  const { data } = await supabase.auth.getSession();
}

export async function getStatusDays(id) {
  const { data, error } = await supabase
    .from("status_days")
    .select("date, id, journal, mood")
    .eq("account_id", id);
  return data;
}

export async function getPendingPosts(id) {
  const { data, error } = await supabase
    .from("pending_posts")
    .select("*")
    .eq("student_id", id);
  data.forEach((obj) => delete obj.student_id);
  data.forEach((obj) => delete obj.ai_say);
  return data;
}

export async function deletePendingPost(post_id) {
  const { error } = await supabase
    .from("pending_posts")
    .delete()
    .eq("id", post_id);
  console.log("Nadelete na sa supabase hehe");
}

export async function deletePost(post_id) {
  const { error } = await supabase.from("posts").delete().eq("id", post_id);
  console.log("Nadelete na sa supabase hehe");
}

export async function getPosts(id) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id, 
        mood,
        content,
        datetime,
        students (
                anonymous_name
        ),
        reactions (
                type,
                student_id
        )
        `,
    )
    .order("id", { ascending: false })
    .limit(7);

  function groupReactions(posts, currentUserId) {
    return posts.map((post) => {
      const counts = {};
      let myreact = null;

      post.reactions?.forEach((r) => {
        if (!r?.type) return;

        // detect your reaction
        if (r.student_id === currentUserId) {
          myreact = r.type;
          return; // 👈 skip counting your own reaction
        }

        // count others' reactions only
        counts[r.type] = (counts[r.type] || 0) + 1;
      });

      return {
        ...post,
        reactions: counts,
        myreact,
      };
    });
  }

  return groupReactions(data, id);
}

export async function getMyPosts(id) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id, 
        mood,
        content,
        datetime,
        student_id,
        reactions (
                type,
                student_id
        )
        `,
    )
    .eq("student_id", id)
    .order("id", { ascending: false });
  data.forEach((obj) => delete obj.student_id);

  function groupReactions(posts, currentUserId) {
    return posts.map((post) => {
      const counts = {};
      let myreact = null;

      post.reactions?.forEach((r) => {
        if (!r?.type) return;

        // detect your reaction
        if (r.student_id === currentUserId) {
          myreact = r.type;
          return; // 👈 skip counting your own reaction
        }

        // count others' reactions only
        counts[r.type] = (counts[r.type] || 0) + 1;
      });

      return {
        ...post,
        reactions: counts,
        myreact,
      };
    });
  }

  return groupReactions(data, id);
}

export async function updateReact(post_id, student_id, reaction) {
  if (reaction == null) {
    await supabase
      .from("reactions")
      .delete()
      .eq("post_id", post_id)
      .eq("student_id", student_id);
  } else {
    const { data, error } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", post_id)
      .eq("student_id", student_id);

    if (data.length > 0) {
      await supabase
        .from("reactions")
        .update({ type: reaction })
        .eq("post_id", post_id)
        .eq("student_id", student_id);
    } else {
      await supabase
        .from("reactions")
        .insert([{ post_id: post_id, student_id: student_id, type: reaction }]);
    }
  }
}
