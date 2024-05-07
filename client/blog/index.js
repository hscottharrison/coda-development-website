import { createClient } from '@supabase/supabase-js';


async function init() {
  const categories = await (await fetch('http://localhost:8080/categories')).json();
  console.log("CATEGORIES: ", categories);
  const supabaseUrl = 'https://yeeohvfasiodwextfhtj.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZW9odmZhc2lvZHdleHRmaHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMDYxMzYsImV4cCI6MjAzMDU4MjEzNn0.93PnJeEsboDfyrXgQ8sBVdYCEW4xbd2Z8bfo2zjOo3k' 
  const supabase = createClient(supabaseUrl, supabaseKey)
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: 'hunter@codadevelopment.net',
  //   password: '6974769nana.',
  // });

  supabase.auth.onAuthStateChange((event, session) => {
      console.log('EVENT', event)
      if (event === "SIGNED_IN") {
        // setUser(session?.user);
        console.log('SIGNED IN', session)
      }
    });
}

await init();