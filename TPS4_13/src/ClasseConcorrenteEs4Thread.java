public class ClasseConcorrenteEs4Thread extends Thread {

    public ClasseConcorrenteEs4Thread(String nome) {
        setName(nome);
    }

    @Override
    public void run() {
        System.out.println("Nome: " + getName());
        System.out.println("ID: " + getId() + " | Priorità: " + getPriority());
        for (int i = 1; i <= 15; i++) {
            System.out.println("[" + getName() + "] " + i);
        }
    }
}