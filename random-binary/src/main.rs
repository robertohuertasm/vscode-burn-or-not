use std::env;

fn main() {
    println!("Hello, world! {:?}", env::var("NAME"));
}
