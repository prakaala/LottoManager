﻿// <auto-generated />
using System;
using LottoManager.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace LottoManager.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250210235128_AddedSalesReport")]
    partial class AddedSalesReport
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("LottoManager.Models.GasStation", b =>
                {
                    b.Property<int>("GasStationID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("GasStationID"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("GasStationID");

                    b.ToTable("GasStations");
                });

            modelBuilder.Entity("LottoManager.Models.Lottery", b =>
                {
                    b.Property<int>("LotteryID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("LotteryID"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("GameNumber")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<string>("ImageURL")
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("LotteryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("PackSize")
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<int?>("SlotNumber")
                        .HasColumnType("int");

                    b.HasKey("LotteryID");

                    b.ToTable("Lotterys");
                });

            modelBuilder.Entity("LottoManager.Models.SalesReport", b =>
                {
                    b.Property<int>("ReportID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("ReportID"));

                    b.Property<int>("ActivatedTickets")
                        .HasColumnType("int");

                    b.Property<int>("ConfirmedTickets")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<bool>("EmailSent")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("GasStationID")
                        .HasColumnType("int");

                    b.Property<int>("SoldOutPacks")
                        .HasColumnType("int");

                    b.Property<int>("TotalSales")
                        .HasColumnType("int");

                    b.Property<int>("TotalTicketsSold")
                        .HasColumnType("int");

                    b.HasKey("ReportID");

                    b.HasIndex("GasStationID", "Date")
                        .IsUnique();

                    b.ToTable("SalesReports");
                });

            modelBuilder.Entity("LottoManager.Models.TicketInventory", b =>
                {
                    b.Property<int>("InventoryID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("InventoryID"));

                    b.Property<DateTime?>("ActivateDate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("ConfirmDate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("CreateAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("CurrentNumber")
                        .HasColumnType("int");

                    b.Property<int>("EndNumber")
                        .HasColumnType("int");

                    b.Property<string>("GameNumber")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<int>("GasStationID")
                        .HasColumnType("int");

                    b.Property<int>("LotteryID")
                        .HasColumnType("int");

                    b.Property<string>("LotteryName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("PackNumber")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<int>("PackSize")
                        .HasColumnType("int");

                    b.Property<int?>("SlotNumber")
                        .HasColumnType("int");

                    b.Property<DateTime?>("SoldOutDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("StartNumber")
                        .HasColumnType("int");

                    b.Property<int>("TotalSold")
                        .HasColumnType("int");

                    b.Property<int>("ValueAmount")
                        .HasColumnType("int");

                    b.HasKey("InventoryID");

                    b.HasIndex("LotteryID");

                    b.HasIndex("GasStationID", "LotteryID")
                        .IsUnique();

                    b.ToTable("TicketInventorys");
                });

            modelBuilder.Entity("LottoManager.Models.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("UserID"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("GasStationID")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("longtext");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.HasKey("UserID");

                    b.HasIndex("GasStationID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("LottoManager.Models.SalesReport", b =>
                {
                    b.HasOne("LottoManager.Models.GasStation", "GasStation")
                        .WithMany()
                        .HasForeignKey("GasStationID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GasStation");
                });

            modelBuilder.Entity("LottoManager.Models.TicketInventory", b =>
                {
                    b.HasOne("LottoManager.Models.GasStation", "GasStation")
                        .WithMany("TicketInventorys")
                        .HasForeignKey("GasStationID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LottoManager.Models.Lottery", "Lottery")
                        .WithMany()
                        .HasForeignKey("LotteryID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GasStation");

                    b.Navigation("Lottery");
                });

            modelBuilder.Entity("LottoManager.Models.User", b =>
                {
                    b.HasOne("LottoManager.Models.GasStation", "GasStation")
                        .WithMany()
                        .HasForeignKey("GasStationID")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("GasStation");
                });

            modelBuilder.Entity("LottoManager.Models.GasStation", b =>
                {
                    b.Navigation("TicketInventorys");
                });
#pragma warning restore 612, 618
        }
    }
}
